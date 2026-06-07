# Dietify — Analytics & Error Tracking Specification

**Version:** 1.0  
**Status:** Pre-release draft — write before the first internal beta build  
**Author:** Product Analytics  
**Last Updated:** 2026-03-25

---

## 1. Tooling

| Concern | Tool | Rationale |
|---|---|---|
| Product analytics | Firebase Analytics | Native Android SDK; already integrated for cloud sync |
| Crash reporting | Firebase Crashlytics | Automatic stack traces, ANR detection, no extra SDK |
| AI failure logging | `FirebaseCrashlytics.recordException()` | Non-fatal custom exceptions; attaches key–value context |
| Third-party analytics | None | Out of scope for MVP |

### Setup Checklist

- [ ] Add `google-services.json` with both `firebase_analytics` and `crashlytics` services enabled
- [ ] In `Application.onCreate()`: call `FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true)` (respect user opt-out flag from settings)
- [ ] Set `FirebaseAnalytics.setAnalyticsCollectionEnabled(true)` by default; expose toggle in Settings → Privacy
- [ ] Enable `FirebaseAnalytics.setUserId()` with an **anonymous UUID** — never with a real user ID or email
- [ ] Set `debug_mode` via `adb shell setprop debug.firebase.analytics.app <package>` during development to inspect events in DebugView

---

## 2. Event Taxonomy

### Naming Convention

| Rule | Detail |
|---|---|
| Format | `{noun}_{verb}` — snake\_case, past-tense verb |
| Examples | `meal_logged`, `plan_approved`, `coach_opened` |
| Max event name length | 40 characters (Firebase hard limit) |
| Max parameter name length | 40 characters (Firebase hard limit) |
| Max parameter value length | 100 characters |
| Max parameters per event | 25 (Firebase hard limit) |
| Max distinct event names | 500 per app — use generic events with params rather than proliferating names |

**Anti-patterns to avoid:**

- Do not embed PII in event names or parameter values (food names, weights, chat text, photo references)
- Do not create one event name per meal type — use a `meal_type` parameter instead
- Do not log free-form strings from user input as parameter values

---

## 3. Core Events

### 3.1 Onboarding Events

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `onboarding_started` | User opens the app for the first time after install | `app_version` (string) | Fire once per install. Gate on a persisted flag in SharedPreferences |
| `step_completed` | User advances past any onboarding screen | `step_number` (int, 1–N), `step_name` (string: `"goal"` / `"profile"` / `"dietary"` / `"allergies"` / `"review"`) | Allows funnel analysis — which step causes the most drop-off |
| `cloud_sync_enabled` | User taps "Enable Sync" on the sync offer screen | `provider` (string: `"google"`) | |
| `cloud_sync_skipped` | User taps "Skip" on the sync offer screen | — | Log alongside `cloud_sync_enabled` to track adoption rate |
| `onboarding_completed` | User taps "Get Started" after plan generation | `duration_seconds` (int), `dietary_preset` (string: `"vegetarian"` / `"vegan"` / `"omnivore"` / `"custom"`) | Duration = elapsed time from `onboarding_started`. Do not log the user's actual dietary restrictions as a string |

### 3.2 Coach Tab Events

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `coach_opened` | User taps the Coach tab | `session_number` (int, incremented per cold-start) | |
| `message_sent` | User sends a message in the coach chat | `input_type` (string: `"text"` / `"voice"` / `"image"`) | Never log message content or transcribed text |
| `plan_proposed` | Gemini returns a structured meal plan response | `tool_calls_in_turn` (int), `response_tokens` (int) | Tracks how many tool calls the AI needed to generate a plan |
| `plan_approved` | User taps "Apply Plan" | `day_count` (int: how many days the plan covers) | |
| `plan_edited` | User modifies an AI-proposed plan before approving | `edits_count` (int) | Tracks how often users override AI suggestions |
| `photo_logged` | User successfully submits a food photo for logging | `source` (string: `"camera"` / `"gallery"`) | Never log the image, filename, or any food name extracted from it |

### 3.3 Tracker Tab Events

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `tracker_opened` | User taps the Tracker tab | `selected_date_offset` (int, 0 = today, negative = past) | |
| `meal_checked` | User ticks a meal checkbox (marking it eaten) | `meal_slot` (string: `"breakfast"` / `"lunch"` / `"dinner"` / `"snack"`) | Never log the meal name or food items |
| `meal_unchecked` | User unticks a previously checked meal | `meal_slot` (string, same enum as above) | |
| `meal_manually_edited` | User edits a meal's macro values inline | `field_edited` (string: `"calories"` / `"protein"` / `"carbs"` / `"fat"`) | Log which field was edited; never log the before/after value |
| `meal_deleted` | User deletes a meal entry | `meal_slot` (string) | |
| `manual_meal_added` | User adds a meal not in the AI-generated plan | `meal_slot` (string) | Tracks how often users supplement the AI plan manually |

### 3.4 Stats Tab Events

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `stats_opened` | User taps the Stats tab | `active_view` (string: `"weekly"` / `"monthly"`) | Log which view is shown by default |
| `month_changed` | User navigates to a different month in Stats | `direction` (string: `"forward"` / `"back"`), `months_offset` (int) | Measures historical data curiosity |
| `weight_entry_viewed` | User views the weight log list or chart | `entry_count` (int: how many entries exist) | Never log any weight value |

### 3.5 AI Tool Call Events

> These events track the Gemini tool-call loop. Fire them inside the AI repository layer, not in the ViewModel.

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `tool_call_triggered` | Gemini returns a `functionCall` part in the response | `tool_name` (string: `"log_meal"` / `"update_plan"` / `"read_tracker"` etc.), `turn_number` (int) | One event per tool call, not per turn |
| `tool_call_succeeded` | The Room operation resolves without throwing | `tool_name` (string), `duration_ms` (int) | Pair with `tool_call_triggered` using `turn_number` to measure success rate |
| `tool_call_failed` | The Room operation throws, or Gemini rejects the result | `tool_name` (string), `error_type` (string: `"db_exception"` / `"schema_mismatch"` / `"timeout"` / `"unknown"`) | This event fires the Crashlytics non-fatal alongside — see §4.2 |

### 3.6 System Events

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `app_opened` | `Activity.onStart()` on any cold or warm start | `launch_type` (string: `"cold"` / `"warm"`), `app_version` (string) | Supplement Firebase's automatic `app_open` event with launch type |
| `offline_detected` | `ConnectivityManager` callback fires with no active network | `previous_state` (string: `"online"` / `"unknown"`) | |
| `sync_completed` | Room-to-Firestore sync worker completes without error | `records_synced` (int), `duration_ms` (int) | |
| `sync_failed` | Sync worker exhausts retries | `failure_reason` (string: `"network"` / `"auth"` / `"quota"` / `"unknown"`) | Also record a non-fatal Crashlytics event — see §4.2 |

---

## 4. Error Tracking

### 4.1 Crash-Level Errors (Crashlytics Automatic)

Crashlytics captures the following automatically when the SDK is initialised. **No action needed — enabled by default.**

- Unhandled exceptions (JVM crashes via the default `UncaughtExceptionHandler`)
- ANRs (Application Not Responding) on Android 11+
- Native crashes via NDK if native code is used
- Fatal signals (SIGSEGV, SIGABRT, etc.)

Each crash report includes: device model, OS version, app version, RAM/storage state, and the full stack trace.

### 4.2 Non-Fatal Errors to Log Manually

Call `FirebaseCrashlytics.getInstance().recordException(throwable)` after setting custom keys. Always set keys **before** calling `recordException`.

| Error Name | Trigger | Crashlytics Method | Custom Keys to Attach |
|---|---|---|---|
| `ai_response_malformed` | Gemini returns a response body that fails JSON parsing or does not match the expected schema | `recordException(JsonParseException)` | `"tool_name"` (string), `"response_length"` (int), `"turn_number"` (int) |
| `tool_call_db_write_failed` | Room throws any exception after a Gemini `functionCall` result is processed | `recordException(roomException)` | `"tool_name"` (string), `"table_affected"` (string), `"error_code"` (string from SQLiteException) |
| `image_compression_failed` | The photo logging pipeline (resize → compress → upload) throws at any stage | `recordException(ioException)` | `"pipeline_stage"` (string: `"resize"` / `"compress"` / `"upload"`), `"source"` (string: `"camera"` / `"gallery"`) |
| `sync_conflict_detected` | LWW (Last-Write-Wins) resolver triggers because two records share the same primary key with different `updated_at` timestamps | `recordException(SyncConflictException)` | `"conflict_table"` (string), `"winner"` (string: `"local"` / `"remote"`), `"delta_ms"` (int: difference in timestamps) |
| `api_rate_limit_hit` | Gemini API returns HTTP 429 | `recordException(RateLimitException)` | `"retry_after_seconds"` (int from response header), `"endpoint"` (string) |

**Code pattern:**

```kotlin
val crashlytics = FirebaseCrashlytics.getInstance()
crashlytics.setCustomKey("tool_name", toolName)
crashlytics.setCustomKey("table_affected", tableName)
crashlytics.recordException(exception)
```

### 4.3 User-Facing Error Messages

Never expose technical error details (stack traces, HTTP codes, DB error strings) to the user.

| Error Code | User Message | Technical Log Message |
|---|---|---|
| `ERR_AI_PARSE` | "Something went wrong with your request. Please try again." | `ai_response_malformed: JSON parse failure at turn {N}` |
| `ERR_DB_WRITE` | "We couldn't save your changes. Please try again." | `tool_call_db_write_failed: {tableName} threw {exception.message}` |
| `ERR_PHOTO` | "We couldn't process your photo. Please try a different image." | `image_compression_failed at stage {stage}: {exception.message}` |
| `ERR_SYNC_CONFLICT` | "Your data has been updated on another device." | `sync_conflict_detected on {table}: {winner} won by {delta_ms}ms` |
| `ERR_RATE_LIMIT` | "The AI coach is busy. Please wait a moment and try again." | `api_rate_limit_hit: 429 received; retry_after={seconds}s` |
| `ERR_OFFLINE` | "You're offline. Your changes will sync when you reconnect." | `offline_detected: ConnectivityManager state = NONE` |
| `ERR_GENERIC` | "Something went wrong. Please restart the app." | `unhandled_exception: {exception.class}: {exception.message}` |

---

## 5. Privacy Rules

These rules are **mandatory**, not advisory. Any violation blocks release.

### 5.1 PII Prohibition

The following must **never** appear in any event parameter value:

- Real names or user-entered identifiers
- Food names or meal descriptions (log meal slot, not meal content)
- Exact numeric health values (weight, calories, macros)
- Chat message text or voice transcripts
- Photo images, filenames, or food recognition labels
- IP addresses, device serial numbers

### 5.2 Macro Logging (Range Bucketing)

When logging nutrition context (for debugging only, not for analytics events), bucket values into ranges:

| Nutrient | Ranges |
|---|---|
| Calories | `"<1200"`, `"1200-1500"`, `"1500-1800"`, `"1800-2200"`, `"2200-2600"`, `">2600"` |
| Protein (g) | `"<50"`, `"50-100"`, `"100-150"`, `"150-200"`, `">200"` |
| Carbs (g) | `"<100"`, `"100-200"`, `"200-300"`, `">300"` |
| Fat (g) | `"<40"`, `"40-80"`, `"80-120"`, `">120"` |

### 5.3 Photo Logging

Log only:
- That a photo was submitted: `photo_logged` event fires
- The source: `"camera"` or `"gallery"`

Never log: the image itself, its filename, its URI, or any food name derived from AI vision analysis.

### 5.4 Google Play Data Safety Form

The following data types are collected and must be declared:

| Data Type | Collected | Shared with Third Parties | Purpose |
|---|---|---|---|
| App interactions (events) | Yes | No | Analytics (Firebase, first-party) |
| Crash logs | Yes | No | Crash reporting (Crashlytics, first-party) |
| Device identifiers | Yes (anonymous UUID only) | No | Analytics session attribution |

**Not collected:** name, email, precise location, health data values, financial info, photos, audio, or contacts.

All Firebase services used (Analytics, Crashlytics) are Google first-party; they do not constitute third-party sharing under Play's data safety policy. Confirm in the Play Console form that no data is shared with third parties.

---

## 6. Dashboard KPIs

Monitor these five metrics in the Firebase Analytics dashboard. Set up custom funnel reports and audience segments as needed.

| Metric Name | Formula | MVP Target | Alarm Threshold |
|---|---|---|---|
| **D1 Retention** | (users who return on day 1) ÷ (new users on day 0) × 100 | ≥ 35% | < 25% |
| **D7 Retention** | (users who return on day 7) ÷ (new users on day 0) × 100 | ≥ 20% | < 12% |
| **Meals Logged per DAU** | `SUM(meal_checked events)` ÷ `DISTINCT(user_id)` per day | ≥ 2.0 | < 1.2 |
| **Coach Opened per DAU** | `COUNT(coach_opened)` ÷ `DAU` per day | ≥ 0.6 | < 0.3 |
| **Plan Approved Rate** | `COUNT(plan_approved)` ÷ `COUNT(plan_proposed)` × 100 | ≥ 70% | < 50% |

### Alarm Response

- **D1 or D7 retention** below threshold → review onboarding funnel; check `step_completed` drop-off by `step_name`
- **Meals logged per DAU** below threshold → investigate if `tool_call_failed` rate is elevated; check `sync_failed` events
- **Coach opened per DAU** below threshold → consider push notification prompt after 2 days of no coach interaction
- **Plan approved rate** below threshold → check `ai_response_malformed` rate; review Gemini prompt in `ai_prompt.md`

---

## Appendix A — Firebase Analytics Limits Reference

| Limit | Value |
|---|---|
| Max event name length | 40 characters |
| Max parameter name length | 40 characters |
| Max parameter value length (string) | 100 characters |
| Max parameters per event | 25 |
| Max distinct custom event names per app | 500 |
| Max distinct custom parameter names per event | 25 |
| Max user properties | 25 |

Events that exceed these limits are silently dropped by the SDK. Run `adb logcat -s FA-SVC` during development to confirm events register correctly.

---

## Appendix B — Event Name Length Audit

All event names defined in this document are verified against the 40-character limit:

| Event Name | Length |
|---|---|
| `onboarding_started` | 19 ✓ |
| `step_completed` | 14 ✓ |
| `cloud_sync_enabled` | 19 ✓ |
| `cloud_sync_skipped` | 19 ✓ |
| `onboarding_completed` | 21 ✓ |
| `coach_opened` | 12 ✓ |
| `message_sent` | 12 ✓ |
| `plan_proposed` | 13 ✓ |
| `plan_approved` | 13 ✓ |
| `plan_edited` | 12 ✓ |
| `photo_logged` | 12 ✓ |
| `tracker_opened` | 14 ✓ |
| `meal_checked` | 12 ✓ |
| `meal_unchecked` | 14 ✓ |
| `meal_manually_edited` | 21 ✓ |
| `meal_deleted` | 12 ✓ |
| `manual_meal_added` | 18 ✓ |
| `stats_opened` | 12 ✓ |
| `month_changed` | 13 ✓ |
| `weight_entry_viewed` | 20 ✓ |
| `tool_call_triggered` | 20 ✓ |
| `tool_call_succeeded` | 20 ✓ |
| `tool_call_failed` | 17 ✓ |
| `app_opened` | 10 ✓ |
| `offline_detected` | 16 ✓ |
| `sync_completed` | 14 ✓ |
| `sync_failed` | 11 ✓ |

**Total distinct event names: 27** — well within the 500-event limit.
