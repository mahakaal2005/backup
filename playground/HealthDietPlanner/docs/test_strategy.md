# Dietify — Test Strategy

> **Version:** 1.0 · **Date:** 2026-03-25 · **Status:** Pre-QA Sprint / Production-Ready Draft
>
> **AI Engine:** Gemini 2.5 Flash · **Architecture:** Jetpack Compose + Room + ViewModel + WorkManager
>
> **Related documents:** `design_tokens.md`, `component_spec.md`, `ai_coach_conversation_spec.md`, `technical_design_document.pdf`

---

## 1. Testing Philosophy

Dietify is an offline-first application: the happy path is always local. The Room database is the ground truth for all user data, and the UI must be fully functional without a network connection. This philosophy drives a strict testing hierarchy — a failure at a lower layer should never propagate upward to corrupt the user experience at a higher layer. AI failures (Gemini API errors, malformed tool calls, timeouts) must never break core meal tracking; the Tracker tab (Tab 2) must be independently testable in complete isolation from the network. The priority hierarchy for test coverage sprint ordering is: **Room DB correctness > Compose UI correctness > AI integration > Cloud sync.** Failures at the top of this hierarchy constitute P0 bugs that block release; failures at the bottom constitute P2 enhancements. Every test case in this document has a single, unambiguous pass/fail criterion — there are no "soft" outcomes.

---

## 2. Test Coverage Targets (by Layer)

| Layer | Tool | Min Coverage Target | Critical Paths |
|---|---|---|---|
| ViewModel | JUnit 5 + Turbine (Flow testing) | 85 % line coverage | Meal toggle → macro recalculation; AI tool call dispatch → DB write; TDEE formula correctness; error → UI state propagation |
| Room DAO | JUnit 4 Instrumented Test (`@RunWith(AndroidJUnit4::class)`) | 100 % of all exported DAO methods | Insert, update, delete, date-range query, `dayOfWeek` query, migration v1→v2 |
| Compose UI | `ComposeTestRule` (`createComposeRule`) | All interactive states per component | Swipe-to-delete, long-press edit sheet, macro ring color transitions, chat bubble layout at 360 dp, empty state CTA navigation |
| AI Integration | Mock stub (OkHttp `MockWebServer`) + limited real API smoke | 100 % of failure paths mocked; 1 real E2E happy path per release | Text response, tool call fire + Room write, vision upload, API error 429, malformed JSON |
| Sync | WorkManager `TestListenableWorkerBuilder` | All conflict resolution paths | Deduplication on reconnect; no data loss on migration; offline queue flush |

---

## 3. Unit Tests — ViewModel Layer

> **Test runner:** JUnit 5 · **Coroutine dispatcher:** `UnconfinedTestDispatcher` · **Flow assertion:** Turbine `test {}` block
>
> **Pass criterion:** Each test asserts a single `@Test` function that either completes without exception or asserting the expected value equals the observed value. Any unhandled exception = FAIL.

| Test ID | ViewModel | Scenario | Input | Expected Output | Edge Case Flag |
|---|---|---|---|---|---|
| **VM-TR-01** | `TrackerViewModel` | User checks a meal → `isLogged` flips to `true` | Call `toggleMealLogged(mealId = 42)` | `uiState.meals.find { it.id == 42 }.isLogged == true` | — |
| **VM-TR-02** | `TrackerViewModel` | Macro ring values update immediately after meal check | `toggleMealLogged(mealId = 42)`; meal has P:30 C:50 F:10 Cal:410 | `uiState.macroSummary.consumedProtein` increased by 30; `consumedCalories` increased by 410 | — |
| **VM-TR-03** | `TrackerViewModel` | Calorie ring hits >100 % overflow | Log a meal that pushes `consumedCalories` beyond `targetCalories` | `uiState.macroSummary.calorieProgressState == EXCEEDED` | ⚠ Boundary: exactly at 100 % = AT_GOAL, not EXCEEDED |
| **VM-TR-04** | `TrackerViewModel` | Protein ring at exactly 85 % threshold emits NEAR_GOAL | Set consumed protein = `goal * 0.85` | `uiState.macroSummary.proteinProgressState == NEAR_GOAL` | ⚠ Boundary: 84.9 % = UNDER_GOAL |
| **VM-TR-05** | `TrackerViewModel` | Day view changes date → correct meals loaded from Room | Call `selectDate(LocalDate.of(2026, 3, 26))` | `uiState.meals` contains only meals for `2026-03-26`; previous day's meals not present | — |
| **VM-CO-01** | `CoachViewModel` | User sends a text message → state transitions to `PROCESSING` | Call `sendMessage("Build me a 5-day plan")` | `uiState.chatState == ChatState.PROCESSING` before first token arrives | — |
| **VM-CO-02** | `CoachViewModel` | Successful `update_meal_plan` tool call → Room write triggered | Mock API returns valid `function_call` JSON for `update_meal_plan` with 3 meal entries | `mealPlanDao.insertAll()` called once; inserted list size == 3 | — |
| **VM-CO-03** | `CoachViewModel` | `update_meal_plan` tool call with missing `dayOfWeek` field → auto-retry | Mock API returns malformed tool call (no `dayOfWeek`) | ViewModel retries once (`retryCount == 1`); `uiState.chatState` remains `PROCESSING` during retry | ⚠ Max 1 auto-retry then ERROR |
| **VM-CO-04** | `CoachViewModel` | Gemini API timeout (>10 s) → `ERROR` state + inline retry visible | Delay mock response beyond 10 000 ms | `uiState.chatState == ChatState.ERROR`; `uiState.showRetryButton == true` | — |
| **VM-CO-05** | `CoachViewModel` | Offline state → `sendMessage()` rejected, snackbar emitted | Set mock `ConnectivityManager` to `OFFLINE`; call `sendMessage("anything")` | No API call made; `uiState.offlineBannerVisible == true` | — |
| **VM-ST-01** | `StatsViewModel` | Consistency score = 100 % when all 7 days have ≥1 logged meal | Insert mock `MealLog` entries for every day of the current week | `uiState.consistencyScore == 100` | — |
| **VM-ST-02** | `StatsViewModel` | Consistency score = 0 % when no meals logged this week | No `MealLog` entries in Room for the current week | `uiState.consistencyScore == 0` | ⚠ Week boundary: test starts Monday |
| **VM-ST-03** | `StatsViewModel` | Heatmap data maps correctly to a 5×7 grid | Insert logs for exactly 15 days over last 5 weeks | `uiState.heatmapGrid.size == 35`; exactly 15 cells have `hasLog == true`, 20 have `hasLog == false` | — |
| **VM-OB-01** | `OnboardingViewModel` | TDEE calculation correct for 23yo female, 58 kg, 164 cm, Sedentary, Cut goal | Call `computeTDEE(age=23, gender=FEMALE, weight=58, height=164, activityLevel=SEDENTARY, goal=CUT)` | Result is `1497 kcal` ±5 kcal (Mifflin-St Jeor BMR = 1349 kcal × 1.2 = 1619 TDEE; −10 % for cut = 1457 kcal; verify to spec) | ⚠ Validate with `onboarding_logic_spec.md` formula |
| **VM-OB-02** | `OnboardingViewModel` | Macro split for a Cut goal follows 40/35/25 P/C/F | Call `computeMacros(targetCalories = 1600, goal = CUT)` | `protein == 160g`, `carbs == 140g`, `fats == 44g` (within ±1g rounding) | — |
| **VM-OB-03** | `OnboardingViewModel` | Validation rejects age below 13 | Call `validateAge(age = 12)` | `validationResult == ValidationError.AGE_TOO_LOW`; continue button disabled | ⚠ Edge: age = 13 must pass |
| **VM-OB-04** | `OnboardingViewModel` | Validation rejects negative weight | Call `validateWeight(weight = -1.0f)` | `validationResult == ValidationError.INVALID_WEIGHT`; continue button disabled | ⚠ Edge: weight = 0.0 also invalid |

---

## 4. DAO Tests — Room Database

> **Test runner:** JUnit 4 `@RunWith(AndroidJUnit4::class)` · **Test DB:** `Room.inMemoryDatabaseBuilder(context, DietifyDatabase::class.java).build()` · **Scope:** `@Before` creates a fresh in-memory DB; `@After` closes it.
>
> **Pass criterion:** Each test makes exactly one assertion against the post-operation DB state. Match = PASS. Any mismatch or thrown exception = FAIL.

| Test ID | Entity | Operation | Input | Expected DB State |
|---|---|---|---|---|
| **DAO-01** | `MealLog` | `insert` | `MealLog(id=0, foodName="Oatmeal", mealType=BREAKFAST, protein=8, carbs=30, fats=3, calories=179, date="2026-03-25")` | `mealLogDao.getByDate("2026-03-25")` returns a list of size 1; `result[0].foodName == "Oatmeal"` |
| **DAO-02** | `MealLog` | `update` macros | Insert a `MealLog` with `protein=20`; call `update()` with same `id` but `protein=35` | `mealLogDao.getById(id).protein == 35`; row count unchanged (still 1 row) |
| **DAO-03** | `MealLog` | `delete` | Insert a `MealLog`; call `delete(mealLog)` | `mealLogDao.getByDate(date)` returns an empty list |
| **DAO-04** | `MealLog` | `queryByDate` single day | Insert 5 `MealLog` rows for `2026-03-25` and 3 rows for `2026-03-26` | `mealLogDao.getByDate("2026-03-25").size == 5`; `getByDate("2026-03-26").size == 3` |
| **DAO-05** | `MealPlan` | `queryByDayOfWeek` | Insert a `MealPlan` row with `dayOfWeek=3` (Wednesday) and one with `dayOfWeek=5` | `mealPlanDao.getByDayOfWeek(3).size == 1`; `result[0].dayOfWeek == 3` |
| **DAO-06** | `MealPlan` | `insert` with all required fields | `MealPlan(dayOfWeek=1, title="Spinach Omelette", scheduledTime="08:00", targetProtein=30, targetCarbs=5, targetFats=12, targetCalories=248)` | `mealPlanDao.getByDayOfWeek(1)` returns 1 row; all six numeric/string fields match the inserted values exactly |
| **DAO-07** | `MealPlan` | `deleteAll` + `insertAll` (plan replacement) | Call `mealPlanDao.deleteAll()`; then `insertAll(List<MealPlan> of size 21)` | `mealPlanDao.getAll().size == 21` |
| **DAO-08** | `UserProfile` | `upsert` (insert then update) | Insert `UserProfile(weight=70.0)`; upsert with `weight=72.5` (same primary key) | `userProfileDao.get().weight == 72.5`; row count == 1 (no duplicates) |
| **DAO-09** | `MealLog` | Date-range query | Insert logs for `2026-03-20` through `2026-03-26` (7 days × 2 logs = 14 rows) | `mealLogDao.getByDateRange("2026-03-22", "2026-03-24").size == 6` (3 days × 2) |
| **DAO-10** | Migration | v1 → v2 (no data loss) | Seed a v1 Room DB with 10 `MealLog` rows; run `MigrationTestHelper` with `MIGRATION_1_2`; open v2 DB | `mealLogDao.getAll().size == 10`; all original `foodName` strings are preserved; new nullable column added in v2 has `null` values for all pre-existing rows |

---

## 5. Compose UI Tests

> **Test runner:** `@RunWith(AndroidJUnit4::class)` · **Rule:** `@get:Rule val composeTestRule = createComposeRule()` · **Device target:** 360 dp width (compact) unless stated.
>
> **Pass criterion:** Each test ends with at least one `assert*()` or `onNode().assertIsDisplayed()` call that passes without `AssertionError`. Any `AssertionError` or uncaught exception = FAIL.

| Test ID | Screen / Component | User Action | Expected UI State | Assertion |
|---|---|---|---|---|
| **UI-01** | TrackerScreen / `MealRow` | Swipe left ≥ 120 dp on a `MealRow` | Delete layer (red background + delete icon) is fully visible; row removed from list after confirmation | `onNodeWithTag("delete_layer_42").assertIsDisplayed()`; after confirm: `onNodeWithTag("meal_row_42").assertDoesNotExist()` |
| **UI-02** | TrackerScreen / `MealRow` | Long press (500 ms) on a `MealRow` | Inline edit fields (Quantity + Unit) slide in; rest of card dims to 60 % opacity | `onNodeWithTag("edit_quantity_field_42").assertIsDisplayed()`; `onNodeWithTag("edit_unit_dropdown_42").assertIsDisplayed()` |
| **UI-03** | TrackerScreen / `MacroRing` | Protein consumed exceeds 100 % of goal | Ring color stays `successReward` (#34D399); ring does NOT turn `error` | `onNodeWithTag("macro_ring_PROTEIN").assertContentDescriptionContains("exceeded")`; screenshot comparison: `successReward` pixel expected |
| **UI-04** | CoachScreen / `ChatBubble` | Coach message rendered at 360 dp device width | Bubble max-width ≤ 270 dp (75 % of 360 dp) | `onNodeWithTag("coach_bubble_last").fetchSemanticsNode().boundsInRoot.width <= 270f` |
| **UI-05** | CoachScreen / `SuggestionChipRow` | User taps a suggestion chip | All chips animate out (dismissed); tapped chip text populates input field | After 200 ms: `onNodeWithTag("suggestion_chip_row").assertDoesNotExist()`; `onNodeWithTag("chat_input").assertTextContains(chipText)` |
| **UI-06** | TrackerScreen / `EmptyState` | User taps "Ask Coach to plan" CTA on empty tracker | Navigation event fires; Coach tab becomes selected | `onNodeWithTag("coach_tab").assertIsSelected()` (or verify `NavController.currentDestination.route == "coach"`) |
| **UI-07** | TrackerScreen / `MacroRing` | Calorie ring reaches 85 % threshold mid-session | Ring color transitions from `primary` to `warning` within 200 ms | Before threshold: ring color == `primary`; after threshold cross: `onNodeWithTag("calorie_ring").assertContentDescriptionContains("near-goal")` |
| **UI-08** | CoachScreen / `RichCard` | User taps APPROVE button on a meal-plan proposal card | Both action buttons replaced by checkmark + "Logged to Tracker" row; card left border turns `secondary` | `onNodeWithTag("approve_button").assertDoesNotExist()`; `onNodeWithTag("approved_confirmation_row").assertIsDisplayed()` |
| **UI-09** | TrackerScreen / `MealRow` | Swipe left < 120 dp then release | Card snaps back to original position; no delete triggered | `onNodeWithTag("delete_layer_42").assertDoesNotExist()`; `onNodeWithTag("meal_row_42").assertIsDisplayed()` |
| **UI-10** | TrackerScreen / `ShimmerSkeleton` | Data load takes > 0 ms (skeleton → real content) | Skeleton renders first; after data arrives, crossfade to real content within 200 ms; skeleton no longer in composition | `onNodeWithTag("meal_row_skeleton_0").assertIsDisplayed()` initially; after data emitted: `onNodeWithTag("meal_row_skeleton_0").assertDoesNotExist()` |

---

## 6. AI Integration Tests

### 6.1 Mock Stub Strategy

All AI integration tests use **OkHttp `MockWebServer`** as a local HTTP server. The Retrofit/Ktor client's base URL is replaced with `mockWebServer.url("/")` in the test setup. No real Gemini API calls are made in automated tests (except for one optional real E2E smoke test gated by a `@Tag("smoke")` annotation run only in CI on release branches).

**Interceptor pattern:**
1. `@Before`: Start `MockWebServer`; build `GeminiApiClient` with `mockWebServer.url("/")` as base URL.
2. Enqueue a `MockResponse` with the desired JSON body and HTTP status code using `mockWebServer.enqueue(MockResponse().setBody(json).setResponseCode(200))`.
3. Trigger the ViewModel action under test.
4. `@After`: Shut down `MockWebServer`.

---

### 6.2 Mock Response Payloads

**Payload 1 — Text Response (nominal)**
```json
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "Your 7-day Cut plan is locked in — 1,900–2,000 kcal/day." }],
      "role": "model"
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": { "promptTokenCount": 142, "candidatesTokenCount": 18 }
}
```

**Payload 2 — Tool Call (`update_meal_plan`)**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "functionCall": {
          "name": "update_meal_plan",
          "args": {
            "meals": [{
              "dayOfWeek": 1,
              "title": "Spinach Omelette",
              "scheduledTime": "08:00",
              "targetProtein": 30,
              "targetCarbs": 5,
              "targetFats": 12,
              "targetCalories": 248
            }]
          }
        }
      }],
      "role": "model"
    },
    "finishReason": "STOP"
  }]
}
```

**Payload 3 — Vision / Multimodal Response**
```json
{
  "candidates": [{
    "content": {
      "parts": [{ "text": "That looks like chicken biryani — roughly 420 kcal, 28g protein, 55g carbs, 10g fat per serving. Want me to log it?" }],
      "role": "model"
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": { "promptTokenCount": 512, "candidatesTokenCount": 32 }
}
```

**Payload 4 — API Error (HTTP 429 / Rate Limit)**
```json
{
  "error": {
    "code": 429,
    "message": "Resource has been exhausted (e.g. check quota).",
    "status": "RESOURCE_EXHAUSTED"
  }
}
```
*(Enqueued with `setResponseCode(429)`.)*

**Payload 5 — Malformed Response (missing required tool-call field)**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "functionCall": {
          "name": "update_meal_plan",
          "args": {
            "meals": [{
              "title": "Spinach Omelette",
              "scheduledTime": "08:00",
              "targetProtein": 30
            }]
          }
        }
      }],
      "role": "model"
    },
    "finishReason": "STOP"
  }]
}
```
*(Note: `dayOfWeek`, `targetCarbs`, `targetFats`, and `targetCalories` are missing — triggers auto-retry logic.)*

---

### 6.3 Integration Test Cases

| Test ID | Scenario | Mock Response | Expected App Behavior |
|---|---|---|---|
| **AI-01** | User sends a text message; model returns a plain text reply | Payload 1 (text response, HTTP 200) | `CoachViewModel.uiState.chatState == RESPONDED`; new coach message bubble appears in `uiState.messages` with the text body; no Room DB write triggered |
| **AI-02** | Model returns a valid `update_meal_plan` tool call | Payload 2 (tool call, HTTP 200) | `CoachViewModel` calls `mealPlanDao.insertAll()`; inserted list size == 1; `uiState.chatState` transitions `PROCESSING → TOOL_EXECUTING → RESPONDED` in order |
| **AI-03** | User sends a food photo; model returns vision analysis | Payload 3 (vision, HTTP 200) | Coach message bubble contains calorie estimate; `log_consumed_meal` is **not** called (analysis-only); `uiState.suggestions` contains "Log it" chip |
| **AI-04** | API returns HTTP 429 (rate limit) | Payload 4 (error, HTTP 429) | `uiState.chatState == ERROR`; error message text matches spec §2 tone ("couldn't reach"); no Room write; `showRetryButton == true` |
| **AI-05** | Model returns a tool call missing `dayOfWeek` | Payload 5 (malformed, HTTP 200) | ViewModel auto-retries once (second `MockWebServer` request received); if second attempt also malformed: `uiState.chatState == ERROR`; Crashlytics event fired (verify via mock Crashlytics stub) |

---

## 7. Offline Simulation Tests

> **Setup method:** Inject a `FakeConnectivityObserver` that returns `NetworkStatus.OFFLINE` before each test action. Restore to `ONLINE` in teardown unless overridden per test.
>
> **Pass criterion:** Each test verifies Room/local state is correct AND that no network call was attempted while offline (verify via `mockWebServer.requestCount`).

| Test ID | Setup | Action | Expected Behavior |
|---|---|---|---|
| **OFF-01** | Seed Room with 5 `MealLog` entries for today; set `ConnectivityObserver` → `OFFLINE` | Open TrackerScreen (Tab 2) | All 5 meals render from Room with correct names, macros, and `isLogged` state; no network request made (`mockWebServer.requestCount == 0`); no error UI shown |
| **OFF-02** | Set `ConnectivityObserver` → `OFFLINE` | Open CoachScreen (Tab 1) | Top snackbar "No connection — Coach unavailable" is visible; input bar is disabled; `uiState.offlineBannerVisible == true`; no API request made |
| **OFF-03** | Seed Room with 30 days of `MealLog` history; set `ConnectivityObserver` → `OFFLINE` | Open StatsScreen (Tab 3) | Consistency score calculated from local Room data; heatmap grid rendered with historical data; no spinner shown; no network request made |
| **OFF-04** | Enqueue offline meal-log actions (pre-seed `SyncQueue`); toggle `ConnectivityObserver` → `ONLINE` | WorkManager `SyncWorker` executes | All queued actions are sent to the server (verify via `mockWebServer.requestCount == queueSize`); `SyncQueue` is empty after worker completes; DB state unchanged (local data not duplicated) |
| **OFF-05** | Seed Room with 1 `MealLog` row for meal ID 99; mock server returns the same meal (same ID, same fields) in the sync response | Trigger sync and receive conflicting server response | No duplicate created (`mealLogDao.getAll().size == 1`); local entry is preserved (local-wins conflict strategy); `lastSyncedAt` timestamp updated |

---

## 8. Performance Benchmarks

> **Measurement method:** All latency benchmarks run on a **Pixel 6 (mid-range reference device)** via `androidx.benchmark.junit4.BenchmarkRule`. UI frame benchmarks use Perfetto traces captured during `@Test` with `composeTestRule.mainClock.advanceTimeBackgroundIdle()`.
>
> **Pass criterion:** Median value across 10 iterations must be ≤ the stated target. Any single run that exceeds 2× the target is flagged as a flake and re-run; three consecutive flakes = FAIL.

| Operation | Target Latency | Measurement Method |
|---|---|---|
| Room read — single `MealLog` by primary key | ≤ 2 ms | `BenchmarkRule` wrapping `mealLogDao.getById(id)` on IO dispatcher; 10 iterations median |
| Room write — new `MealLog` insert | ≤ 5 ms | `BenchmarkRule` wrapping `mealLogDao.insert(mealLog)` on IO dispatcher; 10 iterations median |
| Macro ring animation load (0° → target arc, 400 ms animation) | ≤ 16 ms per frame (60 fps) | Perfetto trace; verify 0 dropped frames during `transitionProgressRing` 400 ms window |
| Chat message render — new `ChatBubble` composition | ≤ 16 ms initial composition time | `composeTestRule.mainClock` advance; measure composable composition time via `RecompositionCounter` |
| Photo compression — user image before upload | ≤ 800 ms (95th percentile) for a 12 MP JPEG → 512×512 WebP | `BenchmarkRule` wrapping `ImageCompressor.compress(bitmap)` on IO dispatcher; 10 iterations p95 |

---

*End of Dietify — Test Strategy v1.0*
