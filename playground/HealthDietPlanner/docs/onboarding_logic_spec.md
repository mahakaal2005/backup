# Dietify — Onboarding Logic Specification

**Version:** 1.0  
**Author:** Product Engineering  
**Date:** 2026-03-25  
**Status:** Draft — Approved for ViewModel Implementation

---

## 1. Input Validation Rules

All onboarding inputs are collected across the Setup Wizard screens. Validation is enforced **on the ViewModel layer** before the "Next" button becomes enabled. No network call is made until all fields pass validation.

### 1.1 Field Constraints

| Field | UI Control | Type | Min | Max | Default Value | Validation Error Message |
|---|---|---|---|---|---|---|
| `age` | Slider | `Int` | 13 | 90 | `25` | "Age must be between 13 and 90." |
| `weight_kg` | Slider | `Float` | 30.0 | 250.0 | `70.0` | "Weight must be between 30 kg and 250 kg." |
| `height_cm` | Slider | `Float` | 100.0 | 250.0 | `170.0` | "Height must be between 100 cm and 250 cm." |
| `gender` | Single-select Chip | `String` (Enum) | — | — | `null` (required) | "Please select a gender." |
| `goal` | Single-select Chip | `String` (Enum) | — | — | `null` (required) | "Please select a goal." |
| `diet_type` | Single-select Chip | `String` (Enum) | — | — | `NON_VEG` | "Please select a diet type." |
| `allergies` | Multi-select Chips | `List<String>` | 0 items | 10 items | `emptyList()` | "Too many allergies selected (max 10)." |

### 1.2 Enum Values

| Field | Valid Values |
|---|---|
| `gender` | `MALE`, `FEMALE` |
| `goal` | `BULK`, `CUT`, `MAINTAIN` |
| `diet_type` | `VEG`, `NON_VEG`, `VEGAN` |
| `allergies` | `GLUTEN`, `DAIRY`, `NUTS`, `EGGS`, `SOY`, `SHELLFISH`, `FISH`, `WHEAT`, `SESAME`, `PEANUTS` |

### 1.3 Validation Rules

- **`gender`** and **`goal`** are mandatory. The screen's "Next" CTA remains disabled until both are selected.
- **`diet_type`** defaults to `NON_VEG` if the user does not tap a chip. It is technically pre-selected.
- **Sliders** enforce min/max at the UI component level; the ViewModel performs a secondary bounds check before persisting.
- **`allergies`** is optional (zero selections is valid). Selections exceeding 10 are rejected with an error toast.
- Slider values displayed to the user are rounded to one decimal place. Values stored in the DB are stored as-is (Float precision).

---

## 2. TDEE Calculation

Dietify uses the **Mifflin-St Jeor** equation as the primary BMR estimator. Harris-Benedict is explicitly **not used**. The Mifflin-St Jeor equation is more accurate for modern sedentary populations.

### 2.1 BMR Formulas

**Male:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
```

**Female:**
```
BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
```

> All values are in metric units (kg and cm). Result is in **kcal/day**.

### 2.2 Activity Multiplier Table

| Level | Label | Multiplier | Description |
|---|---|---|---|
| 1 | Sedentary | 1.2 | Little or no exercise, desk job |
| 2 | Lightly Active | 1.375 | Light exercise 1–3 days/week |
| 3 | Moderately Active | 1.55 | Moderate exercise 3–5 days/week |
| 4 | Very Active | 1.725 | Hard exercise 6–7 days/week |
| 5 | Extra Active | 1.9 | Very hard exercise + physical job |

**Default activity multiplier for new users: Sedentary × 1.2.**

**Rationale:** Dietify collects no activity data during onboarding (no wearable sync, no activity tracker). Defaulting to Sedentary is the medically conservative choice — it prevents over-estimating caloric needs for a new user whose actual activity level is unknown. Users can adjust this later (out of scope for v1 onboarding).

### 2.3 TDEE Formula

```
TDEE = BMR × activity_multiplier
```

### 2.4 Worked Example

**Inputs:** Male, 25 years old, 75 kg, 180 cm, Sedentary

**Step 1 — Calculate BMR:**
```
BMR = (10 × 75) + (6.25 × 180) − (5 × 25) + 5
    = 750 + 1125 − 125 + 5
    = 1755 kcal/day
```

**Step 2 — Apply Activity Multiplier:**
```
TDEE = 1755 × 1.2 = 2106 kcal/day
```

**Result:** TDEE = **2106 kcal/day**

---

## 3. Macro Split by Goal

### 3.1 Macro Ratios

| Goal | Caloric Target | Protein (%) | Carbs (%) | Fats (%) | Notes |
|---|---|---|---|---|---|
| `BULK` | TDEE + 300 kcal | 25% | 50% | 25% | Caloric surplus for lean muscle gain. Protein kept high to support hypertrophy. |
| `CUT` | TDEE − 400 kcal | 35% | 40% | 25% | Caloric deficit. Elevated protein to preserve muscle mass during fat loss. |
| `MAINTAIN` | TDEE | 30% | 45% | 25% | Isocaloric. Balanced macros for weight maintenance and body composition stability. |

> Percentages apply to the **adjusted caloric target** (TDEE ± surplus/deficit), not TDEE alone.

### 3.2 Gram Calculation Formulas

Using standard energy-per-gram constants:

| Macronutrient | kcal per gram |
|---|---|
| Protein | 4 kcal/g |
| Carbohydrates | 4 kcal/g |
| Fats | 9 kcal/g |

```
protein_g  = round((target_kcal × protein_pct) / 4)
carbs_g    = round((target_kcal × carbs_pct) / 4)
fats_g     = round((target_kcal × fats_pct) / 9)
```

> All gram values are **rounded to the nearest whole number** using standard `.roundToInt()` (Kotlin `Math.round()`).

### 3.3 Worked Examples

**Base:** Male, 25yo, 75 kg, 180 cm → TDEE = 2106 kcal/day

#### BULK (Target: 2106 + 300 = 2406 kcal)
| Macro | % | Calculation | Result |
|---|---|---|---|
| Protein | 25% | (2406 × 0.25) / 4 | **151 g** |
| Carbs | 50% | (2406 × 0.50) / 4 | **301 g** |
| Fats | 25% | (2406 × 0.25) / 9 | **67 g** |

#### CUT (Target: 2106 − 400 = 1706 kcal)
| Macro | % | Calculation | Result |
|---|---|---|---|
| Protein | 35% | (1706 × 0.35) / 4 | **149 g** |
| Carbs | 40% | (1706 × 0.40) / 4 | **171 g** |
| Fats | 25% | (1706 × 0.25) / 9 | **47 g** |

#### MAINTAIN (Target: 2106 kcal)
| Macro | % | Calculation | Result |
|---|---|---|---|
| Protein | 30% | (2106 × 0.30) / 4 | **158 g** |
| Carbs | 45% | (2106 × 0.45) / 4 | **237 g** |
| Fats | 25% | (2106 × 0.25) / 9 | **58 g** |

---

## 4. Diet Type Constraints

### 4.1 Restriction Definitions

| Diet Type | Allowed | Excluded |
|---|---|---|
| `NON_VEG` | All foods — meat, fish, seafood, dairy, eggs, plant foods | None |
| `VEG` (Vegetarian) | Dairy, eggs, all plant foods | Meat (beef, pork, chicken, mutton), fish, seafood |
| `VEGAN` | All plant-based foods only | All animal products: meat, fish, dairy (milk, cheese, butter, yogurt), eggs, honey |

### 4.2 How Constraints Are Passed to the AI

**Recommended Approach: System Prompt Context Block**

Diet type constraints are injected as a **structured context block in the AI system prompt** at the start of every session. They are **not** hardcoded in the application as a filter on the AI's output.

**Rationale:**
- **Flexibility:** The AI understands the semantic meaning of dietary restrictions and can apply nuanced judgment (e.g., "paneer is allowed for VEG but not VEGAN").
- **Completeness:** A hardcoded filter list would require exhaustive enumeration of every restricted ingredient, which is brittle and prone to false negatives.
- **Maintainability:** Updating the rule requires changing one string in the prompt, not application code.

**System Prompt Block (injected per session):**

```
## User Dietary Profile
- Diet Type: {diet_type}

### Dietary Restrictions
{if diet_type == "VEG"}
The user is vegetarian. Do NOT suggest any meals containing: meat (beef, chicken, pork, mutton, lamb), fish, or seafood. Eggs and dairy products (milk, cheese, paneer, yogurt, butter) are permitted.
{if diet_type == "VEGAN"}
The user is vegan. Do NOT suggest any meals containing: meat, fish, seafood, dairy products (milk, cheese, butter, ghee, yogurt, paneer, cream), eggs, or honey. All ingredients must be entirely plant-based.
{if diet_type == "NON_VEG"}
The user has no dietary restrictions on food type.
```

---

## 5. Allergy Handling

### 5.1 Storage Format

**Recommendation: `List<String>` serialized as a JSON array string in Room.**

- The `UserProfileEntity.allergies` field is typed as `List<String>` in Kotlin.
- Room stores this via a `TypeConverter` that serializes/deserializes to/from a JSON array string (e.g., `["NUTS","DAIRY"]`).
- **Rationale over comma-separated string:** A JSON array is self-delimiting, handles edge cases (allergen names with commas, empty list), and is trivially deserialized into a Kotlin `List<String>` by Gson/Moshi without manual parsing.

**TypeConverter (Room):**
```kotlin
@TypeConverter
fun fromAllergyList(allergies: List<String>): String = Gson().toJson(allergies)

@TypeConverter
fun toAllergyList(json: String): List<String> =
    Gson().fromJson(json, object : TypeToken<List<String>>() {}.type) ?: emptyList()
```

### 5.2 Injection into AI System Prompt

Allergies are injected immediately after the dietary restriction block as a hard constraint.

**System Prompt Block:**
```
## Allergy Constraints
NEVER suggest any meals or ingredients containing the following allergens. This is a strict safety requirement:
RESTRICTED: {allergies.joinToString(", ")}

Example: If the user is allergic to NUTS and DAIRY, never suggest any recipe, snack, or meal that contains nuts, nut butters, nut oils, milk, cheese, butter, yogurt, cream, or any derivative of these.
```

**If `allergies` is empty:**
```
## Allergy Constraints
The user has no known allergies.
```

### 5.3 Exact Prompt Phrasing

```
NEVER suggest meals containing: {allergies.joinToString(", ")}.
This applies to all direct ingredients and hidden derivatives (e.g., "NUTS" includes peanut butter, almond milk, and walnut oil).
```

### 5.4 Allergy Violation Fallback

If the AI's response is parsed and a meal in `update_meal_plan` JSON is suspected to contain a restricted allergen (via a keyword check on ingredient strings against the user's allergy list):

1. **Log the violation** as a warning in the application logcat (`TAG: AllergyGuard`).
2. **Do not display the violating meal to the user.** Replace the violating meal slot with a placeholder: `"⚠️ Meal could not be generated safely. Please ask your coach for an alternative."`
3. **Trigger a follow-up AI call** with a corrective prompt: `"The meal you suggested for [meal slot] contains [allergen], which the user is allergic to. Please suggest a safe alternative that does not contain [allergen]."`
4. If the follow-up call also fails validation, display the placeholder text permanently for that slot.

> The keyword check is a **secondary safety net**, not a primary guardrail. The system prompt constraint is the primary mechanism.

---

## 6. Initial Meal Plan Generation

This is the first AI call triggered after the user completes onboarding and their `UserProfileEntity` record has been written to Room.

### 6.1 System Prompt Additions for First-Time Users

In addition to the standard dietary and allergy blocks (sections 4 and 5), the following context is prepended for the first generation only:

```
## First-Time User — Initial Meal Plan Generation
This is the user's first time using Dietify. You are generating their initial 7-day meal plan.

### User Biometrics & Goals
- Age: {age}
- Gender: {gender}
- Weight: {weight_kg} kg
- Height: {height_cm} cm
- Goal: {goal}
- Daily Caloric Target: {target_kcal} kcal
- Protein Target: {protein_g}g | Carbs: {carbs_g}g | Fats: {fats_g}g

### Instructions
Generate a practical, nutritionally balanced 7-day meal plan.
- Each day must contain exactly 3 meals: BREAKFAST, LUNCH, DINNER.
- Each meal must include: meal name, a brief description, estimated calories, protein (g), carbs (g), and fats (g).
- The total macros for each day must closely match the user's daily macro targets (within ±10%).
- Prefer common, accessible ingredients. Do not suggest exotic or hard-to-source items.
- Apply all dietary restrictions and allergy constraints defined above.

Respond by calling the `update_meal_plan` tool with the full 7-day plan JSON.
```

### 6.2 Expected Tool Call

The AI must respond by invoking the `update_meal_plan` function call:

```json
{
  "name": "update_meal_plan",
  "parameters": {
    "plan": [
      {
        "date": "2026-03-25",
        "meals": [
          {
            "type": "BREAKFAST",
            "name": "Oats with banana and almond milk",
            "description": "Rolled oats cooked in water, topped with banana slices.",
            "calories": 450,
            "protein_g": 12,
            "carbs_g": 78,
            "fats_g": 9
          },
          { "type": "LUNCH", "...": "..." },
          { "type": "DINNER", "...": "..." }
        ]
      }
      // ... 6 more days
    ]
  }
}
```

The `update_meal_plan` handler in the repository layer iterates the JSON array and inserts one `MealPlanEntity` row per day, with `dayPlanJson` containing the serialized meals array and `status` set to `GENERATED`.

### 6.3 Minimum Viable Plan

| Dimension | Minimum Requirement |
|---|---|
| Days | 7 (one full week) |
| Meals per day | 3 (BREAKFAST, LUNCH, DINNER) |
| Fields per meal | name, type, calories, protein_g, carbs_g, fats_g |

### 6.4 Loading State

While the initial `update_meal_plan` call is in progress (after onboarding completion, before the first response):

- The app navigates to **Tab 1 (AI Coach)**.
- The Coach screen shows a **full-screen shimmer/skeleton loading state** over the meal plan area.
- A centered loading indicator with the text: `"Crafting your personalized meal plan…"` (animated, pulsing).
- The Tab 2 (Tracker) meal checklist shows skeleton cards with "Generating your plan…" label.
- All interactive elements in Tab 2 are disabled during generation.
- Estimated wait time indicator: `"This usually takes 10–20 seconds."` shown beneath the spinner.

### 6.5 Failure Fallback

If the initial meal plan generation fails (network error, API timeout, malformed tool call response):

1. Show a **non-blocking error card** in Tab 1: `"We couldn't generate your first plan. Tap here to try again, or ask your coach to create one."`
2. Tab 2 (Tracker) shows an **empty state illustration** with the message: `"Your meal plan is empty. Ask your coach to create one!"` and a CTA button: `"Ask Coach →"`.
3. The `MealPlanEntity` table remains empty. No rows are written on failure.
4. The error state persists until the user explicitly triggers a retry (via the error card tap or a coach message).

---

## 7. Local Storage After Onboarding

The following Room DB writes happen **atomically** at the conclusion of the onboarding wizard, before navigating to the main app.

### 7.1 Write Sequence

**Step 1 — Create `UserProfileEntity` record**

```kotlin
UserProfileEntity(
    id = UUID.randomUUID().toString(),   // stable UUID for this installation
    age = onboardingState.age,
    weight = onboardingState.weightKg,
    height = onboardingState.heightCm,
    gender = onboardingState.gender,     // "MALE" | "FEMALE"
    goal = onboardingState.goal,         // "BULK" | "CUT" | "MAINTAIN"
    dietType = onboardingState.dietType, // "VEG" | "NON_VEG" | "VEGAN"
    allergies = onboardingState.allergies, // List<String>, stored via TypeConverter
    isCloudSyncEnabled = authState.isAuthenticated, // true if user signed in; false for guest
    updatedAt = System.currentTimeMillis()
)
```

> This is a single-row table. If a row already exists (re-onboarding), perform an `UPSERT` (replace strategy).

**Step 2 — Trigger Initial Meal Plan Generation (async)**

- After `UserProfileEntity` is saved, the `OnboardingViewModel` emits a one-shot side effect triggering the AI call described in Section 6.
- This call runs on `Dispatchers.IO` via a coroutine in the ViewModel scope.
- The `MealPlanEntity` rows are written **only if** `update_meal_plan` tool call succeeds.

**Step 3 — Set `isCloudSyncEnabled`**

| Auth State | `isCloudSyncEnabled` value |
|---|---|
| User signed in with Google/Email | `true` |
| User chose "Continue as Guest" | `false` |

- `WorkManager` sync task is enqueued immediately if `isCloudSyncEnabled == true`.
- `WorkManager` sync task is not scheduled if `isCloudSyncEnabled == false`.

**Step 4 — Navigate to Tab 1 (AI Coach)**

```kotlin
// Emitted as a one-shot NavigationEvent from OnboardingViewModel
navController.navigate(Route.Main(startTab = Tab.COACH)) {
    popUpTo(Route.Onboarding) { inclusive = true }
}
```

Navigation happens **immediately after** Step 1 completes (UserProfileEntity written). The meal plan generation (Step 2) is in progress in the background while the Coach screen loads.

### 7.2 Write Summary Table

| Write | Entity | Condition | Timing |
|---|---|---|---|
| `UserProfileEntity` insert/upsert | `UserProfileEntity` | Always | Synchronous, before navigation |
| `MealPlanEntity` rows (7 days) | `MealPlanEntity` | Only on AI success | Async, after navigation |
| `isCloudSyncEnabled` flag | Part of `UserProfileEntity` | Always | Same as Step 1 |
| `WorkManager` sync task enqueue | N/A (system) | Only if `isCloudSyncEnabled == true` | After Step 1 |

---

## Appendix A — Kotlin Calculation Reference

The following is the canonical Kotlin implementation of the TDEE and Macro calculations to be used in `OnboardingViewModel` or a dedicated `MacroCalculator` use case:

```kotlin
object MacroCalculator {

    fun calculateBmr(weightKg: Float, heightCm: Float, age: Int, gender: String): Float {
        val base = (10f * weightKg) + (6.25f * heightCm) - (5f * age)
        return if (gender == "MALE") base + 5f else base - 161f
    }

    fun calculateTdee(bmr: Float, activityMultiplier: Float = 1.2f): Float {
        return bmr * activityMultiplier
    }

    fun calculateTargetKcal(tdee: Float, goal: String): Float {
        return when (goal) {
            "BULK"     -> tdee + 300f
            "CUT"      -> tdee - 400f
            "MAINTAIN" -> tdee
            else       -> tdee
        }
    }

    data class Macros(val proteinG: Int, val carbsG: Int, val fatsG: Int)

    fun calculateMacros(targetKcal: Float, goal: String): Macros {
        val (proteinPct, carbsPct, fatsPct) = when (goal) {
            "BULK"     -> Triple(0.25f, 0.50f, 0.25f)
            "CUT"      -> Triple(0.35f, 0.40f, 0.25f)
            "MAINTAIN" -> Triple(0.30f, 0.45f, 0.25f)
            else       -> Triple(0.30f, 0.45f, 0.25f)
        }
        return Macros(
            proteinG = Math.round(targetKcal * proteinPct / 4f),
            carbsG   = Math.round(targetKcal * carbsPct  / 4f),
            fatsG    = Math.round(targetKcal * fatsPct   / 9f)
        )
    }
}
```

---

*End of Onboarding Logic Specification v1.0*
