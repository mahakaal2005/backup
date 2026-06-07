# Dietify — API Contract

**Version:** 1.0
**AI Engine:** Gemini 2.5 Flash
**Grounded in:** `ai_prompt.pdf` (system prompt + tool schemas), `technical_design_document.pdf`
**Audience:** Android developers implementing the Retrofit/Ktor API client

---

## 1. Endpoint Configuration

### Base URL and Model

| Parameter | Value |
|---|---|
| Base URL | `https://generativelanguage.googleapis.com` |
| API Version | `v1beta` |
| Model Name | `gemini-2.5-flash` |
| Full Endpoint (non-streaming) | `POST /v1beta/models/gemini-2.5-flash:generateContent` |
| Full Endpoint (streaming) | `POST /v1beta/models/gemini-2.5-flash:streamGenerateContent` |

### Authentication

- **Method:** API Key via query parameter.
- **Parameter name:** `key`
- **Placement:** Query string — **not** an `Authorization` header.
- **Example:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key={API_KEY}`

> **Security note:** Store the API key in `local.properties` and read it via `BuildConfig`. Never commit to VCS.

### Timeout Values

| Timeout Type | Recommended Value | Justification |
|---|---|---|
| Connection timeout | `10 seconds` | Standard for mobile; prevents stalling on bad networks. |
| Read timeout | `60 seconds` | Streaming responses can take time to complete for long meal plans. |
| Write timeout | `15 seconds` | Image payloads (base64-encoded) can be large; 15 s covers the ~300 KB ceiling. |

> The 10 s connection timeout aligns with the `error` state trigger documented in `ai_coach_conversation_spec.md`.

### Retry Policy

| Parameter | Value | Justification |
|---|---|---|
| Max retries | `2` | More than 2 exhausts the user's patience; a hard error message is preferable. |
| Backoff strategy | Exponential — 1 s, 2 s | Reduces thundering-herd problem on Gemini rate limit windows. |
| Retryable HTTP codes | `429`, `500`, `503` | Transient server/quota errors; client errors (4xx) should not be retried. |
| Non-retryable HTTP codes | `400`, `401`, `403` | Configuration or auth errors require human intervention. |

---

## 2. Request Schema

### 2.1 Standard Text Request (Chat + Tool Calling)

This is the canonical request body sent for every turn of the conversation.

```json
{
  "system_instruction": {
    "parts": [
      {
        "text": "You are an elite, highly intelligent, and non-judgmental fitness coach. [... full system prompt from ai_prompt.pdf ...]"
      }
    ]
  },
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "[CURRENT_BIO]: 27yo Male, 80kg, 178cm\n[CURRENT_GOAL]: MAINTAIN\n[TODAY_MACROS]: P: 95/175g, C: 180/250g, F: 45/70g, Cal: 1510/2300kcal\n[REMAINING_MEALS]: Dinner (19:30) — P:60g, C:55g, F:20g\n[RECENT_MANUAL_EDITS]: None\n\nUser message: What should I eat for dinner?"
        }
      ]
    },
    {
      "role": "model",
      "parts": [
        {
          "text": "Based on what you have left, I'd suggest a grilled chicken bowl with brown rice..."
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "text": "[CURRENT_BIO]: 27yo Male, 80kg, 178cm\n[CURRENT_GOAL]: MAINTAIN\n[TODAY_MACROS]: P: 95/175g, C: 180/250g, F: 45/70g, Cal: 1510/2300kcal\n[REMAINING_MEALS]: Dinner (19:30) — P:60g, C:55g, F:20g\n[RECENT_MANUAL_EDITS]: None\n\nUser message: Log it — I just ate that chicken bowl."
        }
      ]
    }
  ],
  "tools": [
    {
      "function_declarations": [
        {
          "name": "update_meal_plan",
          "description": "Propose or update the user's weekly meal plan with specific meal entries. Use when the user asks for a new plan or changes to an existing one.",
          "parameters": {
            "type": "OBJECT",
            "properties": {
              "meals": {
                "type": "ARRAY",
                "description": "List of meal plan entries. Each entry covers one meal slot for a specific day.",
                "items": {
                  "type": "OBJECT",
                  "properties": {
                    "dayOfWeek": {
                      "type": "INTEGER",
                      "description": "Day of the week (1 = Monday, 7 = Sunday)."
                    },
                    "title": {
                      "type": "STRING",
                      "description": "Descriptive name of the meal (e.g., 'Grilled Chicken & Quinoa Bowl')."
                    },
                    "scheduledTime": {
                      "type": "STRING",
                      "description": "Scheduled time in HH:mm format (24-hour clock), e.g., '13:00'."
                    },
                    "targetProtein": {
                      "type": "NUMBER",
                      "description": "Target protein in grams."
                    },
                    "targetCarbs": {
                      "type": "NUMBER",
                      "description": "Target carbohydrates in grams."
                    },
                    "targetFats": {
                      "type": "NUMBER",
                      "description": "Target fats in grams."
                    },
                    "targetCalories": {
                      "type": "NUMBER",
                      "description": "Total target calories for this meal. Must equal (protein × 4) + (carbs × 4) + (fats × 9) ± rounding."
                    }
                  },
                  "required": ["dayOfWeek", "title", "scheduledTime", "targetProtein", "targetCarbs", "targetFats", "targetCalories"]
                }
              }
            },
            "required": ["meals"]
          }
        },
        {
          "name": "log_consumed_meal",
          "description": "Log a meal the user has already eaten into their daily log. Call only with explicit consumption signals ('I ate', 'I had', 'Log this').",
          "parameters": {
            "type": "OBJECT",
            "properties": {
              "foodName": {
                "type": "STRING",
                "description": "Descriptive name of the food, including preparation method if known (e.g., 'Chicken Biryani', 'Masala Oatmeal')."
              },
              "mealType": {
                "type": "STRING",
                "enum": ["BREAKFAST", "LUNCH", "DINNER", "SNACK"],
                "description": "The meal category. Infer from time of day if the user does not specify."
              },
              "timestamp": {
                "type": "STRING",
                "description": "ISO 8601 datetime string with timezone offset (e.g., '2026-03-25T13:45:00+05:30'). Use the current app local time."
              },
              "protein": {
                "type": "NUMBER",
                "description": "Protein content in grams."
              },
              "carbs": {
                "type": "NUMBER",
                "description": "Carbohydrate content in grams."
              },
              "fats": {
                "type": "NUMBER",
                "description": "Fat content in grams."
              },
              "calories": {
                "type": "NUMBER",
                "description": "Total calories."
              }
            },
            "required": ["foodName", "mealType", "timestamp", "protein", "carbs", "fats", "calories"]
          }
        },
        {
          "name": "update_biometrics",
          "description": "Update the user's physical stats or fitness goal in their profile. All fields are optional — only include fields the user explicitly mentioned.",
          "parameters": {
            "type": "OBJECT",
            "properties": {
              "weight": {
                "type": "NUMBER",
                "description": "Body weight in kilograms (e.g., 77.5)."
              },
              "height": {
                "type": "NUMBER",
                "description": "Height in centimeters (e.g., 175.0)."
              },
              "goal": {
                "type": "STRING",
                "enum": ["BULK", "CUT", "MAINTAIN"],
                "description": "The user's fitness objective."
              }
            },
            "required": []
          }
        }
      ]
    }
  ],
  "generation_config": {
    "temperature": 0.4,
    "max_output_tokens": 1000,
    "top_p": 0.9
  }
}
```

**Generation Config Justification:**

| Parameter | Value | Justification |
|---|---|---|
| `temperature` | `0.4` | Low enough to produce consistent, structured tool call JSON; high enough for natural conversational variation. 0.0 is too rigid; 0.7+ introduces hallucinations in function arguments. |
| `max_output_tokens` | `1000` | Covers the longest possible tool call (a 21-meal `update_meal_plan` JSON payload) with headroom. See §5 for budget analysis. |
| `top_p` | `0.9` | Standard nucleus sampling; pairs well with temperature 0.4 to avoid degenerate outputs. |

---

### 2.2 Vision Request (Image + Text)

Used when the user sends a food photo. The structure is identical to §2.1 except the user `parts` array includes an `inline_data` object alongside the text part.

```json
{
  "system_instruction": { "parts": [{ "text": "... system prompt ..." }] },
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "inline_data": {
            "mime_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH..."
          }
        },
        {
          "text": "[CURRENT_BIO]: 27yo Male, 80kg, 178cm\n[CURRENT_GOAL]: MAINTAIN\n[TODAY_MACROS]: P: 95/175g, C: 180/250g, F: 45/70g, Cal: 1510/2300kcal\n[REMAINING_MEALS]: Dinner (19:30) — P:60g, C:55g, F:20g\n[RECENT_MANUAL_EDITS]: None\n\nUser message: I ate this for lunch."
        }
      ]
    }
  ],
  "tools": [ "... same tools array as §2.1 ..." ],
  "generation_config": {
    "temperature": 0.4,
    "max_output_tokens": 1000,
    "top_p": 0.9
  }
}
```

**Image Encoding Rules:**

| Rule | Value |
|---|---|
| `mime_type` allowed values | `image/jpeg`, `image/png`, `image/webp` |
| Encoding | Standard Base64 (RFC 4648), no URL-safe variant, no line breaks |
| Field name | `data` (not `image`, not `base64` — exact Gemini field name) |
| Object key | `inline_data` (not `image_data`, not `blob`) |

---

## 3. Response Handling

### 3.1 Text Response

**Full Response JSON:**

```json
{
  "candidates": [
    {
      "content": {
        "role": "model",
        "parts": [
          {
            "text": "Your 7-day Cut plan is locked in — 1,900–2,000 kcal/day with a 40/35/25 split."
          }
        ]
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [
        { "category": "HARM_CATEGORY_HARASSMENT", "probability": "NEGLIGIBLE" },
        { "category": "HARM_CATEGORY_HATE_SPEECH", "probability": "NEGLIGIBLE" },
        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "probability": "NEGLIGIBLE" },
        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "probability": "NEGLIGIBLE" }
      ]
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 312,
    "candidatesTokenCount": 47,
    "totalTokenCount": 359
  }
}
```

**Extraction path (Kotlin):** `response.candidates[0].content.parts[0].text`

**Edge Case Handling:**

| Condition | Detection | App Behavior |
|---|---|---|
| `candidates` array is empty | `candidates.isEmpty()` | Display inline error: "I couldn't generate a response — please try again." Do not crash. Log the raw response to Crashlytics. |
| `finishReason == "SAFETY"` | `.finishReason == "SAFETY"` | Display: "I can't respond to that — let's keep our focus on nutrition and your goals." Increment a safety block counter for analytics. Do not surface the safety categories to the user. |
| `finishReason == "MAX_TOKENS"` | `.finishReason == "MAX_TOKENS"` | Text may be truncated. If `parts[0].text` ends mid-sentence, append "…" and display. Consider reducing context in the next turn. |
| `parts` is null or empty | `parts.isNullOrEmpty()` | Treat identically to empty `candidates` — display retry error. |

---

### 3.2 Tool Call Response

**Full Response JSON (when model triggers `log_consumed_meal`):**

```json
{
  "candidates": [
    {
      "content": {
        "role": "model",
        "parts": [
          {
            "functionCall": {
              "name": "log_consumed_meal",
              "args": {
                "foodName": "Chicken Biryani",
                "mealType": "LUNCH",
                "timestamp": "2026-03-25T13:45:00+05:30",
                "protein": 28,
                "carbs": 55,
                "fats": 10,
                "calories": 420
              }
            }
          }
        ]
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]
}
```

**Extraction Path:**
```
candidates[0].content.parts[0].functionCall.name       → Tool name (String)
candidates[0].content.parts[0].functionCall.args       → Arguments (JsonObject)
```

**Follow-Up Request (Tool Result Submission):**

After the app processes the tool call (writes to Room DB), it must send the result back to continue the conversation. The `contents` array from the previous request is appended with two new items:

```json
{
  "system_instruction": { "parts": [{ "text": "... system prompt ..." }] },
  "contents": [
    { "role": "user", "parts": [{ "text": "... previous user turn ..." }] },
    {
      "role": "model",
      "parts": [
        {
          "functionCall": {
            "name": "log_consumed_meal",
            "args": {
              "foodName": "Chicken Biryani",
              "mealType": "LUNCH",
              "timestamp": "2026-03-25T13:45:00+05:30",
              "protein": 28,
              "carbs": 55,
              "fats": 10,
              "calories": 420
            }
          }
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "functionResponse": {
            "name": "log_consumed_meal",
            "response": {
              "name": "log_consumed_meal",
              "content": {
                "status": "success",
                "message": "Meal logged to Room DB. Entry ID: abc-123."
              }
            }
          }
        }
      ]
    }
  ],
  "tools": [ "... same tools array ..." ],
  "generation_config": { "temperature": 0.4, "max_output_tokens": 1000, "top_p": 0.9 }
}
```

> **Critical:** The `functionResponse` must be wrapped inside a `role: "user"` content block. The inner `response.name` field must repeat the function name exactly. This is required by the Gemini function-calling protocol.

**Tool Call Error Response:**

If Room DB write fails, return a failure status in the `functionResponse`:

```json
{
  "functionResponse": {
    "name": "log_consumed_meal",
    "response": {
      "name": "log_consumed_meal",
      "content": {
        "status": "error",
        "message": "Room DB write failed: disk full."
      }
    }
  }
}
```

---

### 3.2.1 Tool Result Submission — Minimal Request (Standalone Example)

> **This is the request shape that trips up the most developers.** After your app executes the Room DB write triggered by a `functionCall`, you must send the result back to Gemini before it will reply with a natural-language confirmation. Below is the **complete, minimal request body** for that follow-up POST — stripped of history to show the structure clearly.

```json
POST /v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}
Content-Type: application/json

{
  "system_instruction": {
    "parts": [{ "text": "... system prompt ..." }]
  },
  "contents": [
    {
      "role": "user",
      "parts": [{ "text": "Log it — I just ate that chicken bowl." }]
    },
    {
      "role": "model",
      "parts": [
        {
          "functionCall": {
            "name": "log_consumed_meal",
            "args": {
              "foodName": "Chicken Biryani",
              "mealType": "LUNCH",
              "timestamp": "2026-03-25T13:45:00+05:30",
              "protein": 28,
              "carbs": 55,
              "fats": 10,
              "calories": 420
            }
          }
        }
      ]
    },
    {
      "role": "user",
      "parts": [
        {
          "functionResponse": {
            "name": "log_consumed_meal",
            "response": {
              "name": "log_consumed_meal",
              "content": {
                "status": "success",
                "message": "Meal logged to Room DB. Entry ID: dlog-7f3a2c."
              }
            }
          }
        }
      ]
    }
  ],
  "tools": [ "... same tools array as §2.1 ..." ],
  "generation_config": { "temperature": 0.4, "max_output_tokens": 1000, "top_p": 0.9 }
}
```

**Three structural rules — all three must be correct or Gemini returns a 400:**

| Rule | Correct | Common Mistake |
|---|---|---|
| **1. The `functionCall` turn uses `role: "model"`** | `"role": "model"` | Using `"role": "user"` for the functionCall turn |
| **2. The `functionResponse` turn uses `role: "user"`** | `"role": "user"` | Using `"role": "function"` (OpenAI SDK habit) |
| **3. `response.name` repeats the function name** | `"name": "log_consumed_meal"` inside `response` | Omitting the inner `name` field entirely |

**On success**, Gemini replies with a natural-language confirmation (e.g., `"Done! Chicken Biryani logged — 420 kcal, 28g protein…"`). Use the non-streaming `generateContent` endpoint for this follow-up (the response is short; streaming is unnecessary overhead).

---

### 3.3 Streaming Response

**Decision: Dietify uses streaming (`streamGenerateContent`).**

**Justification:** The AI Coach conversation spec defines a `processing` state with a "typing indicator (3 dots, pulsing)" that resolves as soon as the first token arrives. Blocking mode delays this resolution until the full response is received, which for long tool calls (21-meal plans) can take several seconds. Streaming allows the UI to transition from the typing indicator to the first word of the Coach's text response immediately, maintaining the illusion of a live conversation.

**Streaming Endpoint:** `POST /v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key={API_KEY}`

**Chunk Format:** Each chunk is a Server-Sent Event (SSE) line starting with `data:`, followed by a JSON object with the same structure as a full `generateContent` response, but containing only the tokens generated so far.

```
data: {"candidates":[{"content":{"role":"model","parts":[{"text":"Your 7-day"}]},"index":0}]}

data: {"candidates":[{"content":{"role":"model","parts":[{"text":" Cut plan"}]},"index":0}]}

data: {"candidates":[{"content":{"role":"model","parts":[{"text":" is locked in."}]},"finishReason":"STOP","index":0}],"usageMetadata":{"promptTokenCount":312,"candidatesTokenCount":22,"totalTokenCount":334}}
```

**Handling Chunks for the Typing Indicator:**

1. While `finishReason` is absent or null in the chunk → `processing` state → show typing indicator.
2. On first chunk where `parts[0].text` is non-empty → switch UI to `responded` state → begin appending text to the message bubble.
3. On `finishReason == "STOP"` chunk → mark message as complete → show suggestion chips if present.
4. On `finishReason == "TOOL_USE"` / `functionCall` present → switch to `tool_executing` state.

**Kotlin Implementation Note:** Use `OkHttp`'s `EventSourceListener` or Ktor's `HttpStatement.execute { }` with a streaming body reader. Accumulate text chunks in a `Flow<String>` collected by the ViewModel.

---

## 4. Error Code Handling

| HTTP Code | Meaning | User-Facing Message | Retry? | App Behavior |
|---|---|---|---|---|
| `400 Bad Request` | Malformed request (invalid JSON, missing required field, or unsupported mime_type) | "Something went wrong on our end — please try again." | ❌ No | Log full request body to Crashlytics (redact API key). Do not surface raw error to the user. |
| `401 Unauthorized` | Invalid or missing API key | "The AI Coach is temporarily unavailable. Please check for app updates." | ❌ No | Block all further API calls. Show persistent banner. This should never happen in production if key is in `BuildConfig`. |
| `403 Forbidden` | API key valid but feature/model not accessible (e.g., billing lapsed, model not enabled) | "The AI Coach is temporarily unavailable." | ❌ No | Same as 401 handling. Log to Crashlytics with distinction from 401. |
| `429 Too Many Requests` | Rate limit exceeded | "The Coach is a bit busy right now — I'll try again in a moment." | ✅ Yes | Wait for `Retry-After` header value (seconds) if present; otherwise use exponential backoff (1 s, 2 s). Max 2 retries. Show a subtle loading state, not an error state. |
| `500 Internal Server Error` | Gemini backend error | "Something went wrong. Tap to retry." | ✅ Yes | Retry with exponential backoff. After 2 failed retries, enter `error` state with retry button. |
| `503 Service Unavailable` | Gemini overloaded or under maintenance | "The AI Coach is under heavy load. Tap to retry." | ✅ Yes | Same as 500. Check Gemini API status page in background (optional). |
| Network timeout (no HTTP code) | Connection timeout (`>10 s`) or read timeout during streaming | "Connection timed out. Tap to retry." | ✅ Manual | Enter `error` state immediately. Do **not** auto-retry on timeout — the user may be on a metered connection. Show retry button. |

---

## 5. Token Budget

### 5.1 Max Input Tokens Per Request

| Component | Estimated Token Budget |
|---|---|
| System prompt (`system_instruction`) | ~500 tokens |
| Context injection block (`[CURRENT_BIO]`, `[TODAY_MACROS]`, etc.) | ≤ 200 tokens (as defined in `ai_coach_conversation_spec.md §5.3`) |
| Conversation history (past turns; see §5.3) | ≤ 1,500 tokens |
| Current user message (text) | ≤ 300 tokens |
| Image data (if vision request) | ~260 tokens per 1 MP image (Gemini's fixed vision cost) |
| **Total input budget** | **≤ 2,500 tokens** |

> Gemini 2.5 Flash supports a 1M token context window. The 2,500-token input budget is a self-imposed constraint to ensure fast time-to-first-token, minimize cost, and prevent context bloat as conversations grow long.

### 5.2 Max Output Tokens

- **Hard limit:** `1000 tokens` (set in `generation_config.max_output_tokens`)
- **Justification:** The longest possible model output is a full 21-meal `update_meal_plan` JSON call (~700 tokens) plus a short confirmation text (~50 tokens). 1,000 provides a safe ceiling without wasting quota. Conversational-only responses are typically ≤ 100 tokens.

### 5.3 Conversation History Truncation Strategy

The `contents` array sent to the API is assembled fresh on every turn from the Room DB message history. The following rules apply:

| Rule | Value |
|---|---|
| **Target history window** | Last **6 turns** (3 user + 3 model) |
| **Absolute maximum** | 10 turns — if the rolling 6-turn window exceeds 1,500 tokens, reduce further. |
| **History token threshold** | If history would push total input over 2,500 tokens, start truncating. |

**What to Truncate First (priority order):**

1. **Oldest conversation turns** — drop the oldest user+model message pair first.
2. **`[RECENT_MANUAL_EDITS]`** from the context block — drop oldest edit entries if context block exceeds 200 tokens.
3. **`[REMAINING_MEALS]`** — reduce to next upcoming meal only (from full list) if still over budget.
4. **Tool call message pairs** — if a past turn was a `functionCall` + `functionResponse` pair with no associated text resonse, it may be dropped as a unit.

> **Never truncate** the system instruction, the current user turn, or the `[CURRENT_BIO]` / `[CURRENT_GOAL]` / `[TODAY_MACROS]` fields. These are invariants for every request.

---

## 6. Image Processing Spec

### 6.1 Pre-Processing Pipeline

| Step | Rule | Value |
|---|---|---|
| **1. Size check** | If raw image size exceeds threshold → compress. | Max raw size before compression: **5 MB** |
| **2. Dimension resize** | Resize to fit within a bounded box. | Max dimension: **1024 × 1024 px** (maintain aspect ratio) |
| **3. Quality compression** | JPEG compression after resize. | Quality: **80%** (good visual fidelity; ~150–300 KB output). Reason: Gemini vision performance does not improve meaningfully above 80% quality for food macro estimation. |
| **4. MIME type** | Prefer JPEG after compression. | Use `image/jpeg` for all compressed images. PNG is acceptable for screenshots (lossless). |
| **5. Base64 encode** | Standard Base64, no padding breaks. | Use `Base64.encodeToString(bytes, Base64.NO_WRAP)` in Kotlin. |

### 6.2 Local Caching Strategy

- **What to cache:** The **compressed** bytes (post-resize, pre-Base64) are stored at `DailyLogEntity.imageLocalPath` as a local file URI.
- **When to cache:** Only after the user's meal log is committed to Room DB (i.e., after the AI tool call succeeds and the `functionResponse` is sent).
- **Cache directory:** `context.cacheDir/food_images/` — Android system can evict these under storage pressure. This is intentional; food images are not critical data.
- **Cache key:** `{dailyLogId}.jpg` — 1:1 with the DailyLog entry.
- **Maximum cache size:** 50 MB total. Evict oldest by file modification date when exceeded.

### 6.3 Privacy Rule — Ephemeral Processing

> **Compliance statement:** Food images processed by the AI Coach are sent to the Gemini API over HTTPS and are **not stored server-side by Google** beyond the request lifecycle when using the standard API (non-File API path). Dietify does not use the Gemini File API (`files.create` endpoint), so no image persists on Google's servers after the `generateContent` or `streamGenerateContent` call completes.

- All images are sent as `inline_data` in the request body, not pre-uploaded.
- The local cache in `context.cacheDir` is device-private and excluded from cloud backup by default (set `android:allowBackup` relevant attributes in the `FileProvider` appropriately).
- If the user deletes a log entry in the UI, delete the corresponding `imageLocalPath` file immediately.

---

## 7. Kotlin Integration Notes

### 7.1 Data Models

```kotlin
// Sealed result class for uniform error handling
sealed class ApiResult<out T> {
    data class Success<T>(val data: T) : ApiResult<T>()
    data class Error(val code: Int?, val message: String) : ApiResult<Nothing>()
    object Timeout : ApiResult<Nothing>()
    object NetworkUnavailable : ApiResult<Nothing>()
}
```

### 7.2 Request/Response DTOs (abbreviated)

```kotlin
// --- Request DTOs ---

data class GeminiRequest(
    @SerializedName("system_instruction") val systemInstruction: SystemInstruction,
    @SerializedName("contents") val contents: List<Content>,
    @SerializedName("tools") val tools: List<Tool>,
    @SerializedName("generation_config") val generationConfig: GenerationConfig
)

data class SystemInstruction(
    @SerializedName("parts") val parts: List<Part>
)

data class Content(
    @SerializedName("role") val role: String,         // "user" | "model"
    @SerializedName("parts") val parts: List<Part>
)

// Part can be one of: text, inline_data, functionCall, functionResponse
// Use a sealed class or a single data class with nullable fields:
data class Part(
    @SerializedName("text") val text: String? = null,
    @SerializedName("inline_data") val inlineData: InlineData? = null,
    @SerializedName("functionCall") val functionCall: FunctionCall? = null,
    @SerializedName("functionResponse") val functionResponse: FunctionResponse? = null
)

data class InlineData(
    @SerializedName("mime_type") val mimeType: String,
    @SerializedName("data") val data: String             // Base64 encoded bytes (NO_WRAP)
)

data class FunctionCall(
    @SerializedName("name") val name: String,
    @SerializedName("args") val args: JsonObject         // com.google.gson.JsonObject
)

data class FunctionResponse(
    @SerializedName("name") val name: String,
    @SerializedName("response") val response: JsonObject
)

data class GenerationConfig(
    @SerializedName("temperature") val temperature: Double = 0.4,
    @SerializedName("max_output_tokens") val maxOutputTokens: Int = 1000,
    @SerializedName("top_p") val topP: Double = 0.9
)

// --- Response DTOs ---

data class GeminiResponse(
    @SerializedName("candidates") val candidates: List<Candidate>?,
    @SerializedName("usageMetadata") val usageMetadata: UsageMetadata?
)

data class Candidate(
    @SerializedName("content") val content: Content,
    @SerializedName("finishReason") val finishReason: String?,  // "STOP" | "SAFETY" | "MAX_TOKENS" | "TOOL_USE"
    @SerializedName("index") val index: Int,
    @SerializedName("safetyRatings") val safetyRatings: List<SafetyRating>?
)

data class UsageMetadata(
    @SerializedName("promptTokenCount") val promptTokenCount: Int,
    @SerializedName("candidatesTokenCount") val candidatesTokenCount: Int,
    @SerializedName("totalTokenCount") val totalTokenCount: Int
)
```

### 7.3 Retrofit Interface Signatures

```kotlin
interface GeminiApiService {

    /**
     * Non-streaming request. Use for tool call follow-ups (functionResponse submission)
     * where the response is expected to be short and does not require streaming UI.
     */
    @POST("v1beta/models/gemini-2.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): retrofit2.Response<GeminiResponse>

    /**
     * Streaming request. Primary path for all user-facing chat turns.
     * Returns a ResponseBody that must be read as an SSE stream.
     * Use OkHttp's EventSourceListener or Ktor's streaming body for consumption.
     */
    @Streaming
    @POST("v1beta/models/gemini-2.5-flash:streamGenerateContent")
    suspend fun streamGenerateContent(
        @Query("key") apiKey: String,
        @Query("alt") alt: String = "sse",
        @Body request: GeminiRequest
    ): retrofit2.Response<ResponseBody>
}
```

### 7.4 ViewModel Integration Pattern

```kotlin
// In ChatViewModel
fun sendMessage(userText: String, imageBitmap: Bitmap? = null) {
    viewModelScope.launch {
        _uiState.update { it.copy(coachState = CoachState.Processing) }

        val request = buildRequest(userText, imageBitmap)

        geminiRepository.streamGenerateContent(request)
            .catch { e -> handleError(e) }
            .collect { chunk ->
                when {
                    chunk.hasFunctionCall() -> handleToolCall(chunk.functionCall)
                    chunk.hasText()         -> appendTextToChat(chunk.text)
                    chunk.isFinished()      -> _uiState.update { it.copy(coachState = CoachState.Responded) }
                }
            }
    }
}
```

> **Note on Ktor vs Retrofit:** If the team switches to Ktor (also mentioned in TDD), replace `@Streaming` + `ResponseBody` with `HttpClient.preparePost(...).execute { response -> response.bodyAsChannel().readSSE() }`. The request/response DTOs remain identical. Choose Retrofit if the team is already familiar with it; choose Ktor if Compose Multiplatform is a future consideration.

---

*End of Dietify — API Contract v1.0*
