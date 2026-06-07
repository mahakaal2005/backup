# Dietify — Design Tokens

> **Version:** 1.0 · **Date:** 2026-03-25 · **Status:** Canonical / Single Source of Truth
>
> **Related documents:** `component_spec.md` (component usage), `dietify_stitch_ui_spec.md` (screen prompts)
>
> This file is the authoritative reference for every design token in the Dietify app. All other documents, the Jetpack Compose Theme file, and Google Stitch prompts **must** reference token names from this file. Never use raw hex values in code or spec documents — always use the token name.

---

## 1. Color Tokens

### 1.1 Material 3 Core Palette

| Token Name | Hex Value | Role / Usage Rule |
|---|---|---|
| `primary` | `#10B981` | Brand identity. CTAs, primary buttons, active nav tab, progress rings (under-goal state), primary borders. **Reserved for action and identity only — never for data or state feedback.** |
| `onPrimary` | `#022C22` | Text and icons placed on a `primary`-colored surface. Ensures WCAG ≥ 4.5:1 contrast on small text. |
| `secondary` | `#059669` | Active/hover states, active input borders (2dp stroke), checked states, APPROVE button fill, SAVE button fill. Subdued counterpart to `primary`. |
| `onSecondary` | `#F8FAFC` | Text and icons placed on a `secondary`-colored surface. |
| `surface` | `#020617` | App background (dark theme). Base layer — deepest level in the elevation hierarchy. Scrim color base. |
| `onSurface` | `#F8FAFC` | Primary body text, headings, icon fills on surface-level backgrounds. |
| `surfaceVariant` | `#1E293B` | Card backgrounds, input field backgrounds, chip backgrounds, bottom nav background, shimmer skeleton base, disabled backgrounds. |
| `onSurfaceVariant` | `#94A3B8` | Secondary / muted text, timestamps, placeholder text, inactive labels, macro pill text, value labels below rings. |
| `error` | `#FB7185` | Destructive actions (delete), exceeded-goal ring state, offline/error banners. Soft rose to signal danger without anxiety. |
| `onError` | `#020617` | Text and icons placed on an `error`-colored surface. |

---

### 1.2 Custom Semantic Tokens

| Token Name | Hex Value | Role / Usage Rule |
|---|---|---|
| `focusTint` | `#6EE7B7` | Keyboard-focused input border (2dp), focused state overlay background. **Lighter mint, distinct from `successReward`.** Trigger: user interaction (focus). Never used for achievements. |
| `successReward` | `#34D399` | Goal-hit rewards, near-goal protein ring color, positive achievement feedback, habit streak rewards. Trigger: performance milestone. Never used for CTAs. |
| `warning` | `#FBBF24` | Near-goal calorie ring (85–100%), caution signals. Brighter amber, intentionally distinct from `macroCarbs` orange. |
| `infoStrong` | `#60A5FA` | Info icons, active info element highlights, informational UI accents. |
| `infoSubtleBg` | `#1E3A8A` | Blended info backgrounds at partial opacity. Never used at full opacity. |
| `divider` | `#334155` | Horizontal rule separators between list items, section dividers, shimmer skeleton highlight band. |
| `cardBorder` | `#475569` | Resting card borders (1dp), unselected chip borders, drag handle color, disabled border. Provides depth definition without shadow. |
| `disabledBg` | `#1E293B` | Background of disabled interactive elements. Same value as `surfaceVariant` — use token name, not hex. |
| `disabledText` | `#64748B` | Text on disabled elements (Slate 500). |
| `disabledBorder` | `#334155` | Border of disabled interactive elements. Same value as `divider` — use token name, not hex. |

---

### 1.3 Macro Nutrient Tokens

| Token Name | Hex Value | Never Confuse With |
|---|---|---|
| `macroProtein` | `#3B82F6` | `infoStrong` (#60A5FA) — protein is a distinct, darker blue. |
| `macroCarbs` | `#F97316` | `warning` (#FBBF24) — carbs is orange, warning is amber. Intentionally different family. |
| `macroFats` | `#14B8A6` | `primary` (#10B981) — **teal, NOT primary green**. See conflict rule §7.1. |

> ⚠️ **CONFLICT PREVENTION — Fats Token:**
> `macroFats` is **`#14B8A6` (teal)**. It must never be set to `#10B981` (which is `primary`, the brand green). These two colors are visually similar in low-fidelity mockups and have been incorrectly swapped in past screen prompts (Screen 07 and the UX rules table in `dietify_stitch_ui_spec.md`). Any file that shows `#10B981` as the Fats color is **wrong and must be corrected to `#14B8A6`**. The rule: `primary` is for actions; `macroFats` is for data.

---

### 1.4 Light Theme Overrides

> **Note:** All semantic tokens (`successReward`, `warning`, `error`, macro colors) remain **identical** in light theme. Only surface-level tokens change to maintain hierarchy on a white base.

| Token Name | Dark Theme Value | Light Theme Value | Notes |
|---|---|---|---|
| `surface` | `#020617` | `#FFFFFF` | Pure white base layer. |
| `surfaceVariant` | `#1E293B` | `#F1F5F9` | Slate 100 — slightly darker card bg, correct hierarchy on white. |
| `cardBorder` | `#475569` | `#CBD5E1` | Lighter border to maintain contrast on white surface. Ensure ≥ 4.5:1 contrast on all interactive element text. |

---

### 1.5 Progress Ring Color Logic

| Progress Level | Threshold | Ring Color Token | Notes |
|---|---|---|---|
| Under-goal | < 85 % (any macro) | `primary` | Default state for all three macro rings. |
| Near-goal — calories | 85 %–100 % of calorie target | `warning` | Caution signal: approaching daily limit. 200 ms color lerp transition. |
| Near-goal — protein | 85 %–100 % of protein goal | `successReward` | Positive signal: close to hitting the goal. 200 ms color lerp transition. |
| Exceeded — overeating | > 100 % (calories / carbs / fats) | `error` | Ring fills to 360° with a 4dp gap at start to indicate overflow. 200 ms transition. |
| Exceeded — positive overage | > 100 % (protein) | `successReward` | Protein over-goal is a positive event. Ring stays at `successReward`, no error state. |

---

## 2. Typography Tokens

| Token Name | Font Family | Weight | Size (sp) | Use Case |
|---|---|---|---|---|
| `headingLarge` | Barlow Condensed | Bold (700) | 28 | Screen titles, onboarding headings. |
| `headingSection` | Barlow Condensed | Bold (700) | 20–22 | Tab app bar titles, card section headers, empty state headings. |
| `bodySummaryStats` | Barlow Condensed | Bold (700) | 48 | Large stat numbers (Consistency Score %, daily calorie count). |
| `bodyData` | Barlow Condensed | Bold (700) | 14–18 | Macro values in RichCard, auto-logged card, calorie sub-labels. |
| `bodyLabel` | Barlow | Regular (400) | 14 | Chat bubble text, food log row names, form field values, body copy. **Minimum size.** |
| `monoCalories` | Barlow Condensed | Bold (700) | 28 | Primary calorie count in the Tracker summary card. Tabular figures on. |
| `monoMacroValue` | Barlow Condensed | Bold (700) | 18 | Macro gram values in the auto-logged card macro row. Tabular figures on. |
| `caption` | Barlow | Regular (400) | 10–12 | Timestamps, sub-labels below rings, note text, legend labels. |
| `buttonLabel` | Barlow Condensed | Bold (700) | 14–18 | All button labels (primary, secondary, outlined). All-caps for icon-paired labels. |

### Typography Rules

- **Barlow Condensed** — `ONLY` for screen titles, section headers, and summary stats. Never in food-log rows or dense data lists.
- **Barlow Regular / Medium** — `ALL` food log rows, body text, macro numbers in list context, chat messages.
- **Tabular figures** (`font-variant-numeric: tabular-nums`) — `ALL` live-updating numbers: calorie counts, macro gram values, streak counters.
- **Minimum body font size:** 14sp. No body text may be set below 14sp in any non-caption context.

---

## 3. Shape Tokens

| Token Name | Corner Radius | Applied To |
|---|---|---|
| `shapeCard` | 12 dp | Meal cards (MealRow), summary cards, RichCard, Toast/Snackbar, EmptyState CTA button. |
| `shapeChip` | 24 dp (full pill) | All suggestion chips, allergy chips, macro pills, goal selector chips, meal-type chips. |
| `shapeButton` | 12 dp | Primary and secondary buttons, APPROVE / EDIT action buttons. |
| `shapeBottomSheet` (top corners) | 16 dp | Top-left and top-right corners of all bottom sheets. |
| `shapeBottomSheet` (bottom corners) | 0 dp | Bottom-left and bottom-right corners — flush with screen edge. |
| `shapeInput` | 12 dp | Text input fields, time picker fields, search bars. |
| `shapeTag` | 24 dp (full pill) | Tag / badge pills (e.g. "BUDGET-FRIENDLY" in RichCard header). |

---

## 4. Spacing Tokens

| Token Name | Value (dp) | Typical Use |
|---|---|---|
| `space1` | 4 dp | Tight inline gaps: icon-to-label, dense list row padding. |
| `space2` | 8 dp | Default internal padding, list item vertical rhythm, gap between chips, gap between action buttons. |
| `space3` | 12 dp | Card internal padding (compact), bubble horizontal padding, input field horizontal padding. |
| `space4` | 16 dp | Card internal padding (standard), section header padding, form group spacing. |
| `space5` | 24 dp | Between cards, large section spacing, empty state content group gaps. |
| `space6` | 32 dp | Large section breaks, hero element spacing. |
| `space7` | 48 dp | Screen-level vertical breathing room, minimum touch target height. |
| `screenMarginHorizontal` | 16 dp | All screen-level horizontal padding (left/right safe zone for all content). |

> All layouts use multiples of the 8dp grid.

---

## 5. Elevation & Depth Tokens

| Token Name | Value | Description |
|---|---|---|
| `cardBorderWidth` | 1 dp | Standard resting border width on all cards. Provides ~2.8:1 contrast on `surfaceVariant` — used as a structural cue in place of drop shadows. |
| `cardBorderColor` | `cardBorder` (`#475569`) | Token reference for the resting card/chip border. |
| `activeStateBorderWidth` | 2 dp | Border width on active, selected, or focused interactive elements (input fields, checked cards, active segments). |
| `activeStateBorderColor` | `secondary` (`#059669`) | Token reference for the active/selected border. Used for: active input focus, checked MealRow left border, SAVE button. |
| `navBarTopDividerColor` | `divider` (`#334155`) | 1 dp top-edge divider on the bottom navigation bar. Separates nav bar from content area. |

---

## 6. Animation Tokens

| Token Name | Duration (ms) | Easing | Applied To |
|---|---|---|---|
| `transitionStandard` | 200–300 ms | `FastOutSlowInEasing` (ease-out) | Screen transitions, bottom sheet enter, shimmer crossfade to content, toast enter, composable enter fade. |
| `transitionFast` | 150–200 ms | `FastOutLinearInEasing` (ease-in) | Frequent micro-interactions: checkbox fill, chip dismiss, card tap state layer, toast exit/auto-dismiss. |
| `transitionProgressRing` | 400 ms | Ease-out | Progress ring arc fill animation on first composition. |
| `transitionButtonTap` | 150 ms | Ease-in → Ease-out | Button/card press: scale 1.0 → 0.98 on finger-down, 0.98 → 1.0 on release. Combined with M3 state layer. |
| `transitionGoalHit` | 200 ms (color lerp) | Linear | Progress ring color transition when a threshold boundary is crossed (e.g. under-goal → near-goal). |

---

## 7. Conflict Prevention Rules

The following known token misuse risks have caused or can cause production bugs. Every developer and designer must be aware of these before touching any color reference.

1. **Fats macro vs `primary` (the historical bug)**
   `primary` (`#10B981`, emerald green) and `macroFats` (`#14B8A6`, teal) appear very similar in dark mockups. Screen 07 (auto-logged card) and the UX rules table in `dietify_stitch_ui_spec.md` incorrectly assigned `#10B981` to Fats. **The rule: `primary` is exclusively for CTAs and brand identity. `macroFats` is exclusively for the Fats data track. If the Fats ring, Fats pill, or Fats column ever appears in `#10B981`, it is a bug.**

2. **`successReward` vs CTA buttons**
   `successReward` (`#34D399`) is reserved for achievement reward states (goal hit, habit streak, near-goal protein ring). CTA buttons — including the "Continue" button in onboarding and the "Add Meal" button — must use `primary` (`#10B981`), not `successReward`. If a CTA button is filled with `#34D399`, it incorrectly signals that the user has already achieved a goal, breaking the semantic hierarchy.

3. **`focusTint` vs `successReward`**
   Both are shades of mint/emerald, but they are triggered by completely different events. `focusTint` (`#6EE7B7`) is an **interaction token** — it appears only when the user has keyboard focus on an input field (focus ring border, 2dp). `successReward` (`#34D399`) is an **achievement token** — it appears only when a nutritional performance milestone is reached. Never swap them: a focused input field that shows `successReward` implies the user has succeeded at something; a goal ring that shows `focusTint` implies keyboard focus, which is meaningless.

4. **`warning` vs `macroCarbs`**
   `warning` (`#FBBF24`) is a bright amber used for caution signals (near-goal calorie ring, alerts). `macroCarbs` (`#F97316`) is a distinct orange used exclusively for the carbohydrate data track. They are intentionally different hues: amber vs orange. Using `warning` for the carbs ring would imply the user is approaching their limit at all times. Using `macroCarbs` for a warning state would lose the urgency signal. **Rule: orange for data (`macroCarbs`), amber for state (`warning`). Never interchange.**
