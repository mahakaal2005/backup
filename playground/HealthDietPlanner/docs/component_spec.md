# Dietify — Component Specification

> **Version:** 1.0 · **Date:** 2026-03-25 · **Status:** Production-Ready Draft
>
> **Related documents:** `design_system.md` (design tokens), `screens_outline_and_user_flow.pdf` (screen inventory)

---

## 1. Overview

This document defines every reusable UI component in the Dietify Android app (Jetpack Compose + Material 3). It is the single source of truth that bridges the design system tokens and the screen-level Stitch prompts. Each component section is implementation-ready: a Compose developer must be able to build the component from this spec alone, with no additional design clarification. All measurements are in **dp** (density-independent pixels) and all durations in **ms**. All color references use named tokens from the design system — never raw hex values.

### Components defined in this document

1. MealRow
2. MacroRing
3. ChatBubble
4. RichCard
5. SuggestionChipRow
6. BottomSheet
7. Toast / Snackbar
8. ProgressBar (linear, onboarding)
9. EmptyState
10. ShimmerSkeleton

---

## 2. Components

---

### 2.1 MealRow

**Purpose:** A single food-log list item showing a meal's name, scheduled time, macro pills, calorie count, and completion state; used in the Tracker tab Day View.

#### Variants

- **default** — unchecked / pending meal card
- **checked (logged)** — meal has been marked complete
- **swiping-left** — mid-swipe revealing the delete action layer
- **long-press-edit** — inline edit fields visible (quantity + unit)
- **deleting** — exit animation after confirming swipe-delete

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Idle | Left border `primary` (2dp), checkbox border `cardBorder` | — | — |
| Pressed | M3 state layer: `onSurface` @ 12 % overlay on card | Finger down | 0 ms (immediate) |
| Checked | Left border switches to `secondary` (2dp); checkbox fill `secondary`; text `onSurface` at 60 % opacity (strikethrough none) | Checkbox tap | 200 ms ease-out fill animation on checkbox |
| Swiping-left | Card translates rightward revealing delete layer (see Behavior Notes); delete layer BG `error` fades from 0 → 100 % opacity as offset crosses 8dp | Horizontal drag past 8dp threshold | Proportional to drag velocity |
| Long-press-edit | Quantity and unit fields appear inline (slide-in from below, 200 ms ease-out); rest of card dims to 60 % opacity | 500 ms long-press | 200 ms ease-out |
| Deleting | Card shrinks in height from full → 0dp + fade-out; list collapses with spring animation | Swipe offset > 120dp + finger lift, or DELETE button tap | 250 ms ease-in |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `mealName` | `String` | — | Display name of the meal, e.g. "Beef Thali" |
| `scheduledTime` | `String` | — | Formatted time string, e.g. "1:30 PM" |
| `mealLabel` | `String` | — | Context label appended after time, e.g. "Lunch (Edited)" |
| `protein` | `Int` | — | Grams of protein |
| `carbs` | `Int` | — | Grams of carbohydrates |
| `fats` | `Int` | — | Grams of fat |
| `calories` | `Int` | — | Total kcal (derived, but passed explicitly for display) |
| `isLogged` | `Boolean` | `false` | Controls checked vs. default variant |
| `onToggle` | `() → Unit` | — | Called when checkbox is tapped |
| `onEdit` | `() → Unit` | — | Called when long-press-edit is confirmed |
| `onDelete` | `() → Unit` | — | Called when delete is confirmed after swipe |

#### Behavior Notes

- **Checkbox spec:** 20×20dp, 4dp corner radius, unchecked border 2dp `cardBorder`, checked fill `secondary` with a white checkmark icon (Material Symbols Rounded `check`, 14dp). Touch target is the entire MealRow card, not just the checkbox area.
- **Macro pill layout:** Three pills in a horizontal row, right-aligned. Each pill format: `P:30g`, `C:75g`, `F:8g`. Font: Barlow Regular 11sp, color `onSurfaceVariant`. Pills are not individually tappable.
- **Calorie count position:** Numeric calorie count is right-aligned, vertically centered in the card, displayed as `472 kcal`. Font: Barlow Condensed Bold 14sp, color `onSurface`. Calorie count sits directly below / adjacent to the macro pill row within the right column.
- **Swipe reveal layer dimensions:** The delete layer behind the card is **48dp wide**, full card height. Background `error`. Centered icon: Material Symbols Rounded `delete`, 20dp, color `onError`. The layer is revealed from the right edge as the card translates left. Minimum swipe distance to trigger delete: **120dp** horizontally; below this threshold, card snaps back with spring animation (300 ms).
- **Inline edit on long-press:** Two text fields appear inside the card — `Quantity` (numeric, character limit 4) and `Unit` (dropdown string: g / ml / piece / tbsp). Font: Barlow Regular 14sp. Active border: 2dp `secondary`. Both fields are confirmed by tapping the `✓` icon that replaces the macro pill row.
- **Accessibility:** Content description = `"$mealName, $scheduledTime, $calories kcal, ${if isLogged} logged" else "not yet logged"`. Role = `ListItem`. Checkbox role = `Checkbox`.

#### Do / Don't

**Do:**
- Always show all three macros (P / C / F) even when a value is 0.
- Trigger haptic feedback (`VibrationEffect.EFFECT_CLICK`) on checkbox toggle.
- Snap the card back with spring if the swipe threshold is not met.

**Don't:**
- Don't allow text to wrap onto a second line in the meal name — truncate with ellipsis at 1 line.
- Don't show the calorie count in the inline-edit state; replace with live-calculated value only after save.
- Don't stack multiple delete toasts; one toast replaces the previous (see Toast component).

---

### 2.2 MacroRing

**Purpose:** A circular progress ring displaying a single macro's consumption vs. goal, shown in a row of three rings in the Tracker Day View summary card.

#### Variants

- **under-goal** — progress < 85 %
- **near-goal** — progress 85 %–100 %
- **at-goal** — progress exactly 100 %
- **exceeded** — progress > 100 %

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Loading | Shimmer placeholder (see ShimmerSkeleton 2.10) | Data fetch in progress | — |
| Animated fill (enter) | Ring arc grows from 0° to target angle, clockwise | Composable enters composition | 400 ms ease-out |
| Under-goal | Ring color = macro color token (`macroProtein`, `macroCarbs`, or `macroFats`) | progress < 85 % | — |
| Near-goal / At-goal – calories macro | Ring color transitions to `warning` | progress ≥ 85 % and macro is calories | 200 ms ease-in-out color lerp |
| Near-goal / At-goal – positive macro (protein) | Ring color transitions to `success` | progress ≥ 85 % and macro is protein | 200 ms ease-in-out color lerp |
| Exceeded – overeating | Ring color transitions to `error`; ring continues as a full circle with a 4dp gap at the start (indicates overflow visually) | progress > 100 % for calories / carbs / fats | 200 ms ease-in-out |
| Exceeded – positive overage | Ring stays `success` | progress > 100 % for protein | — |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `macroType` | `Enum(PROTEIN, CARBS, FATS)` | — | Determines base ring color token |
| `current` | `Float` | — | Consumed value in grams |
| `goal` | `Float` | — | Daily goal in grams |
| `diameter` | `Dp` | `56dp` | Outer diameter of the ring |
| `strokeWidth` | `Dp` | `5dp` | Ring stroke width |
| `centerLabel` | `String` | `"P"` / `"C"` / `"F"` | Single character displayed at ring center |
| `showValueLabel` | `Boolean` | `true` | If true, shows `"100/160g"` below the ring |
| `animateOnComposition` | `Boolean` | `true` | Whether to play the 400 ms fill animation on enter |

#### Behavior Notes

- **Ring diameter:** 56dp outer; arc center radius = `(diameter - strokeWidth) / 2`. Unfilled track color: `surfaceVariant`.
- **Stroke width:** 5dp. Cap style: `StrokeCap.Round`.
- **Center label format:** Single uppercase letter only (P / C / F), Barlow Condensed Bold 12sp, color `onSurfaceVariant`.
- **Value label below ring:** Format `"current/goalg"` (e.g. `"100/160g"`), Barlow Regular 10sp, color `onSurfaceVariant`. Positioned 4dp below the ring.
- **Color transitions per progress threshold:** Exactly match design system progress ring logic: `primary` → `warning` (calorie ring near/at goal), `primary` → `success` (protein ring near/at goal), `primary` → `error` (calorie/carbs/fats exceeded). Protein over-goal stays `success`. Color interpolation uses linear lerp over 200 ms.
- **Accessibility:** Each ring announces: `"$macroType: $current grams of $goal grams goal"`. Role = `ProgressIndicator`.
- **Three-ring row layout:** Rings are distributed horizontally with equal spacing within the summary card. Each ring occupies a column of equal weight (1/3 card width), center-aligned.

#### Do / Don't

**Do:**
- Match the ring color to the design system progress logic exactly — never use macro colors for the exceeded state.
- Always animate fill on first composition.
- Let stroke cap be `Round` for a modern aesthetic.

**Don't:**
- Don't display a percentage number inside the ring — only the single-letter label.
- Don't use the same `primary` color for all three rings — each uses its macro color token.
- Don't animate color transitions on every recomposition — only when the progress threshold boundary is crossed.

---

### 2.3 ChatBubble

**Purpose:** A single conversation message unit in the AI Coach tab; renders user-sent or coach-received messages with appropriate layout, shape, and timestamp.

#### Variants

- **user-outgoing** — right-aligned, filled with `primary` background
- **coach-incoming** — left-aligned, `surfaceVariant` background, no avatar
- **coach-with-avatar** — left-aligned, `surfaceVariant` background, with 32dp robot avatar

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Idle | Static bubble, timestamp visible | — | — |
| Pressed | M3 state layer: `onSurface` @ 12 % overlay | Finger down | 0 ms (immediate) |
| Entering | Bubble slides in from bottom (12dp translate Y) + fade from 0 → 100 % opacity | New message appended | 200 ms ease-out |
| Sending (user) | Trailing "clock" icon 12dp replaces checkmark; `onSurfaceVariant` color | Message in transit | Until delivery confirmed |
| Error (user) | Trailing warning icon `error` color; tap to retry | Send failure | — |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Enum(USER_OUTGOING, COACH_INCOMING, COACH_WITH_AVATAR)` | — | Layout and color variant |
| `text` | `String` | — | Message body text |
| `timestamp` | `String` | — | Formatted time, e.g. "9:02 AM" |
| `showTimestamp` | `Boolean` | `true` | Whether to render the timestamp label |
| `showAvatar` | `Boolean` | derived from variant | Whether to show the 32dp avatar |

#### Behavior Notes

- **Max width:**
  - At 360dp screen width: bubble max-width = **270dp** (75 %).
  - At 430dp screen width: bubble max-width = **322dp** (75 %).
  - Never exceed 75 % of the screen width at any screen size.
- **Corner radius per side:**
  - `user-outgoing`: top-left 12dp, top-right **2dp** (square on conversation side), bottom-left 12dp, bottom-right 12dp.
  - `coach-incoming` / `coach-with-avatar`: top-left **2dp** (square on conversation side), top-right 12dp, bottom-left 12dp, bottom-right 12dp.
- **Timestamp position and format:**
  - Outgoing: timestamp below the bubble, right-aligned. Format: `"HH:MM AM/PM"`, Barlow Regular 10sp, color `onSurfaceVariant`.
  - Incoming: timestamp below the bubble, left-aligned (aligned with bubble left edge). Same font/color.
  - Timestamp is always visible (not hidden in collapsed groups).
- **Avatar spec:** 32×32dp circle, background `primary`, icon = Material Symbols Rounded `smart_toy` (robot/AI), icon size 18dp, color `onPrimary`. Avatar is vertically aligned to the bottom of the bubble — not the top.
- **Avatar spacing:** 8dp gap between avatar right edge and bubble left edge.
- **Horizontal padding inside bubble:** 12dp left/right. Vertical padding: 8dp top/bottom.
- **Coach bubble background:** `surfaceVariant`. Text: `onSurface` Barlow Regular 14sp.
- **User bubble background:** `primary`. Text: `onPrimary` Barlow Regular 14sp.
- **Accessibility:** Content description = `"${if coach} "Coach:" else "You:"} $text, $timestamp"`. Role = `LiveRegion` on the coach bubble container so screen readers announce new incoming messages.

#### Do / Don't

**Do:**
- Always use the squared corner on the side closest to the conversation edge (speaker side).
- Maintain 16dp horizontal screen margin outside all bubbles.
- Use `coach-with-avatar` only for the first bubble in a sequential coach turn; subsequent consecutive coach bubbles use `coach-incoming` (no avatar) to avoid visual repetition.

**Don't:**
- Don't let bubbles span full screen width — the 75 % max-width cap is non-negotiable.
- Don't show timestamps on every bubble in a rapid sequence; timestamp is always shown per the spec (toggle logic is a product decision, not a design decision here).
- Don't use emoji as the avatar — use the Material Symbols icon only.

---

### 2.4 RichCard

**Purpose:** An AI-generated proposal card rendered inline in the chat as a structured response; communicates meal plans or food-log confirmations with action buttons.

#### Variants

- **meal-plan-proposal** — shows a proposed meal with APPROVE + EDIT actions
- **auto-logged-confirmation** — shows a logged item with food thumbnail, macros, and a success badge (no action buttons)

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Idle | Static card, full opacity | — | — |
| Entering | Same as ChatBubble enter: 12dp translate Y + fade in | Card appended to chat | 200 ms ease-out |
| APPROVE pressed | Button fills to `secondary` at 100 % (state layer resolved); card dims to 80 % opacity after tap confirmed | Tap APPROVE | 150 ms ease-out |
| Approved (resolved) | Both buttons replaced by a single row: checkmark icon + "Logged to Tracker" text `success` color; card left border changes to `success` | 500 ms after APPROVE tap | 200 ms cross-fade |
| EDIT pressed | Opens Edit Meal BottomSheet above card | Tap EDIT | BottomSheet enter animation (see 2.6) |
| Pressed (card body) | M3 state layer: `onSurface` @ 8 % overlay | Finger down anywhere on card body | 0 ms |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Enum(MEAL_PLAN_PROPOSAL, AUTO_LOGGED_CONFIRMATION)` | — | Card layout variant |
| `title` | `String` | — | Header title text, e.g. "Revised Lunch Plan" |
| `tagLabel` | `String?` | `null` | Optional badge label, e.g. "BUDGET-FRIENDLY" |
| `mealDescription` | `String` | — | Meal name / description line |
| `protein` | `Int` | — | Grams of protein |
| `carbs` | `Int` | — | Grams of carbohydrate |
| `fats` | `Int` | — | Grams of fat |
| `calories` | `Int` | — | Total kcal |
| `thumbnailUrl` | `String?` | `null` | Food photo URL (auto-logged variant only) |
| `loggedTime` | `String?` | `null` | Format "Auto-logged · HH:MM AM/PM" (auto-logged variant only) |
| `onApprove` | `() → Unit` | — | Callback for APPROVE tap (proposal variant only) |
| `onEdit` | `() → Unit` | — | Callback for EDIT tap (proposal variant only) |

#### Behavior Notes

- **Left border accent:** 2dp left-side border, color `primary` for `meal-plan-proposal` and `secondary` for `auto-logged-confirmation`. The border is flush with the card's left edge, inside the card's corner radius clip (rendered as a 2dp wide vertical Rectangle, full card height, with 12dp top-left/bottom-left radius).
- **Header row layout (proposal):** Left — `title` text Barlow Condensed Bold 16sp `onSurface`. Right — `tagLabel` pill (if provided): Barlow Condensed Bold 10sp, text `onPrimary`, background `secondary`, 24dp corner radius, 4dp vertical / 8dp horizontal padding. Title and tag are horizontally spaced with `weight(1f)` on the title and `wrapContent` on the tag.
- **Action button row (proposal):**
  - APPROVE button: filled, background `secondary`, text `onSecondary` "APPROVE", Barlow Condensed Bold 14sp, 12dp radius, 40dp height, leading checkmark icon 16dp. Flex weight = 1.
  - EDIT button: outlined, border 1dp `cardBorder`, text `onSurfaceVariant` "EDIT", Barlow Condensed Bold 14sp, 12dp radius, 40dp height. Flex weight = 1.
  - 8dp gap between buttons. 16dp horizontal padding inside each button.
- **Macro display row format (both variants):** Three columns, each center-aligned. Format per column: `"P:30g"` / `"C:75g"` / `"F:8g"`. Font: Barlow Condensed Bold 14sp. Protein color: `macroProtein`. Carbs color: `macroCarbs`. Fats color: `macroFats`. Row sits below the divider (1dp `divider` color).
- **Auto-logged thumbnail:** 56×56dp, 8dp corner radius, `surfaceVariant` placeholder if image not loaded.
- **Auto-logged success badge:** 28×28dp circle, background `secondary`, icon `check` (Material Symbols Rounded) 14dp, color `onSecondary`.
- **Auto-logged bottom note:** "Macros are AI estimates. Long-press in Tracker to edit." Barlow Regular Italic 11sp, color `onSurfaceVariant`. 8dp top margin.
- **Calorie count in proposal:** Rendered in the macro row as a fourth column: `"$calories kcal"` Barlow Condensed Bold 14sp, color `onSurface`.

#### Do / Don't

**Do:**
- Show the tagLabel pill only when tagLabel is non-null.
- Always display all three macro columns; never hide one even if its value is 0.
- Replace both action buttons with the approved state row after confirmation — do not leave the buttons in a disabled state.

**Don't:**
- Don't remove the left border accent in either variant.
- Don't use the card as a navigation target — it is a read/action component only.
- Don't allow the card to exceed the chat container width; inherit 100 % width minus 16dp horizontal margins.

---

### 2.5 SuggestionChipRow

**Purpose:** A horizontally scrollable row of quick-reply chips presented below a coach message or in the empty chat state to reduce typing friction.

#### Variants

- **visible** — chips displayed, actionable
- **post-tap-dismiss** — chips animate out after one is tapped

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Visible | Chips at full opacity, no interaction in progress | Chips loaded | — |
| Chip-pressed | M3 state layer: `onSurface` @ 12 % overlay on tapped chip | Finger down on chip | 0 ms |
| Post-tap-dismiss | All chips fade from 100 → 0 % opacity and translate Y from 0 → −8dp (slide up) simultaneously | Any chip tap | 150 ms ease-in, then Composable removed from composition |
| Hidden (overflow) | Chips beyond index 2 are not rendered; a `"+N more"` pill is shown | More than 3 chips in list | — |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `chips` | `List<String>` | — | Suggestion text strings |
| `maxVisible` | `Int` | `3` | Max chips shown before overflow pill |
| `onChipTap` | `(String) → Unit` | — | Called with chip text when tapped |

#### Behavior Notes

- **Dismiss animation:** 150 ms fade-out (`alpha` 1→0) combined with 150 ms slide-up (`translationY` 0→−8dp) applied to the entire row, not individual chips. Easing: `FastOutLinearInEasing` (ease-in). After animation completes, the composable is fully removed from the layout.
- **Chip pill shape:** 24dp corner radius (full pill). Height: 36dp. Horizontal padding: 16dp. Background: `surfaceVariant`. Border: 1dp `cardBorder`. Text: Barlow Regular 14sp, color `onSurface`. No icon unless chip string includes a leading icon specification.
- **Max chips rule:** Maximum 3 chips visible at once. If the source list contains 4 or more chips, chips at index 0–2 are rendered normally; a `"+N"` pill (same pill style, text `onSurfaceVariant`) replaces the overflow items. Tapping `"+N"` expands the row to show all chips (no dismiss animation on expand tap).
- **Tap behavior:** Tapping a chip: (1) fires `onChipTap(chipText)`, (2) starts dismiss animation on the entire row, (3) populates the chat input field with the chip text so the user can optionally edit before sending.
- **Row layout:** Chips are laid out in a horizontally scrollable `LazyRow` with 8dp gap between chips, 16dp start padding, 16dp end padding. Row is not wrapped onto multiple lines.
- **Accessibility:** Each chip role = `Button`. Content description = chip text. Row is announced as "Quick reply options" to screen readers.

#### Do / Don't

**Do:**
- Dismiss the entire row (not just the tapped chip) after any chip is tapped.
- Populate the input field with the chip text on tap — do not send immediately.
- Always show the "+N" pill when chip count exceeds `maxVisible`.

**Don't:**
- Don't animate individual chips separately — the whole row animates as a unit.
- Don't show suggestion chips after the user has typed manually in the input field.
- Don't queue a new chip row while the dismiss animation is still running.

---

### 2.6 BottomSheet

**Purpose:** A modal bottom sheet used for food entry and editing, anchored to the bottom of the screen and dismissible via drag or scrim tap.

#### Variants

- **edit-meal** — pre-populated form for editing an existing meal (MealRow long-press)
- **add-meal** — blank form for adding a new meal manually
- **base/generic** — bare sheet scaffold with drag handle and scrim (used as a wrapper for any future sheet content)

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Hidden | Sheet not in composition | — | — |
| Entering | Sheet slides up from bottom of screen (translate Y: 100 % → 0 %) + scrim fades in (0 → scrim opacity) | `show()` called | 300 ms `FastOutSlowInEasing` (ease-out) |
| Idle (resting) | Sheet at full height, scrim at target opacity | Fully entered | — |
| Dragging | Sheet follows finger position; scrim opacity proportional to sheet offset | Vertical drag on sheet | Real-time |
| Dismiss (threshold not met) | Sheet snaps back to resting position | Drag released below dismiss threshold | 200 ms `LinearOutSlowInEasing` spring |
| Dismissing | Sheet slides back down (translate Y: 0 → 100 %) + scrim fades out | Drag past dismiss threshold OR scrim tap | 250 ms `FastOutLinearInEasing` (ease-in) |
| Keyboard visible | Sheet translates up by `WindowInsets.ime` height so primary input remains above keyboard | Soft keyboard appears | Synchronized with keyboard animation (~300 ms) |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Enum(EDIT_MEAL, ADD_MEAL, BASE)` | — | Sheet content variant |
| `isVisible` | `Boolean` | `false` | Controls enter/dismiss state |
| `onDismiss` | `() → Unit` | — | Called when sheet is dismissed by any gesture |
| `mealData` | `MealData?` | `null` | Pre-populated meal for edit-meal variant |

#### Behavior Notes

- **Drag handle dimensions:** 32dp wide × 4dp tall, 2dp corner radius, color `cardBorder`. Centered horizontally at top of sheet, 8dp top margin, 8dp bottom margin before content begins.
- **Corner radius:** Top-left 16dp, top-right 16dp. Bottom-left 0dp, bottom-right 0dp (flush with screen edge). The corner radius is clipped — rounded corners are drawn via `Modifier.clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))`.
- **Scrim opacity:** `surface` color at **70 %** opacity (`Color(0xFF020617).copy(alpha = 0.70f)`). Scrim tap triggers dismiss. Scrim is rendered behind the sheet but above all other screen content.
- **Dismiss gestures:** (1) Swipe down on the sheet until offset > sheet height × 0.35 (35 % of sheet height). (2) Tap the scrim. No other dismiss gestures.
- **Keyboard inset behavior:** Use `Modifier.imePadding()` on the sheet content column so the primary input field is always visible above the soft keyboard. The `[LOG FOOD]` / `[SAVE]` / `[ADD MEAL]` CTA button must also shift above the keyboard — it must never be occluded. The sheet must not overlap the primary input field when the keyboard is open.
- **edit-meal content:** Header "Edit Meal" Barlow Condensed Bold 20sp `onSurface` + X close icon. Fields: MEAL NAME (text), SCHEDULED TIME (time picker), MACROS (3-column inline numeric: Protein / Carbs / Fats). Live calorie calc below macros row. Action row: [DELETE] (1/3 width, outlined `error` border) + [SAVE CHANGES] (2/3 width, filled `secondary`).
- **add-meal content:** Header "Add Meal". Meal Type selector above name field (4 pill chips: Breakfast / Lunch / Dinner / Snack — single select, selected fill `primary`). Fields same as edit-meal but empty. Action row: [CANCEL] (outlined `cardBorder`) + [ADD MEAL] (filled `primary`). No DELETE button.
- **Field active state:** Input border 1dp `cardBorder` at rest → 2dp `secondary` when focused. Background `surface`. Font: Barlow Regular 16sp `onSurface`.
- **Minimum peek height:** `navigationBarHeight + drag_handle_area (48dp)` — ensures content is never clipped on swipe-gesture phones.

#### Do / Don't

**Do:**
- Always render the drag handle regardless of variant.
- Shift the sheet up with the keyboard — never let the keyboard overlap the primary input.
- Close the keyboard before starting the sheet dismiss animation.

**Don't:**
- Don't allow the sheet to be dismissed by swiping up (upward swipe expands the sheet if it is in a partially-expanded state — this spec targets full-screen sheets, so upward swipe has no effect).
- Don't queue multiple sheets — dismiss the current sheet before showing a new one.
- Don't attach rounded corners to the bottom of the sheet.

---

### 2.7 Toast / Snackbar

**Purpose:** A transient feedback message shown above the bottom nav bar to confirm actions (food logged, meal deleted, error) without blocking the UI.

#### Variants

- **success** — confirmation of a completed action (e.g. "Meal logged")
- **error** — notification of a failure (e.g. "Failed to save — check your connection")
- **info** — neutral contextual information (e.g. "AI Coach is calculating…")

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Hidden | Component not in composition | — | — |
| Entering | Translates Y from +24dp → 0dp and fades in (0 → 100 % opacity) | Show called | 200 ms `FastOutSlowInEasing` |
| Visible | Static, full opacity | — | Auto-dismisses per `duration` |
| Swiping (horizontal) | Toast follows horizontal finger offset; opacity decreases proportionally | Horizontal drag | Real-time |
| Dismissed (swipe) | Toast continues in swipe direction and fades out | Drag velocity > 0 + finger lift | 150 ms `FastOutLinearInEasing` |
| Auto-dismiss | Toast translates Y from 0 → +24dp and fades out | `duration` elapsed | 200 ms `FastOutLinearInEasing` |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Enum(SUCCESS, ERROR, INFO)` | — | Visual style of the toast |
| `message` | `String` | — | Message text |
| `actionLabel` | `String?` | `null` | Optional single action button label (e.g. "UNDO") |
| `onAction` | `(() → Unit)?` | `null` | Callback for action button tap |
| `duration` | `Long` | `3000` | Auto-dismiss delay in ms |

#### Behavior Notes

- **Position:** Fixed above the bottom navigation bar. Bottom edge of toast = top edge of nav bar + 8dp gap. Centered horizontally, 16dp horizontal margins.
- **Entry animation:** Translate Y from `+24dp` → `0dp` (slides up) + alpha from `0f` → `1f`. Duration 200 ms, easing `FastOutSlowInEasing`.
- **Exit animation:** Translate Y from `0dp` → `+24dp` + alpha from `1f` → `0f`. Duration 200 ms, easing `FastOutLinearInEasing`.
- **Auto-dismiss duration:** `SUCCESS` = 3000 ms, `ERROR` = 5000 ms (longer for error reading time), `INFO` = 3000 ms.
- **Swipe-to-dismiss direction:** Horizontal swipe only (left or right). Vertical swipe is disabled. Dismiss threshold: swipe offset > 60 % of toast width.
- **Never-stack rule:** If a new toast is triggered while one is already visible, the current toast immediately exits (150 ms accelerated dismiss, no delay) and the new toast enters. There is never more than one toast visible at any time.
- **Variant styling:**

| Variant | Background | Start icon | Text color | Action text color |
|---|---|---|---|---|
| success | `success` | `check_circle` (20dp) | `surface` | `surface` |
| error | `error` | `error` (20dp) | `onError` | `onError` |
| info | `surfaceVariant` | `info` (20dp) | `onSurface` | `primary` |

- **Background shape:** 12dp corner radius. 16dp left / right padding. 12dp top / bottom padding. Min height 48dp.
- **Message font:** Barlow Regular 14sp. Action button: Barlow Condensed Bold 14sp, all-caps.
- **Accessibility:** Role = `AlertDialog`. `LiveRegion = POLITE` (so screen reader announces without interrupting current speech). Error variant uses `ASSERTIVE` LiveRegion.

#### Do / Don't

**Do:**
- Replace any currently visible toast immediately when a new one is triggered.
- Give the error variant a longer auto-dismiss duration (5000 ms) for legibility.
- Always include an icon matching the variant.

**Don't:**
- Don't queue toasts — only one is ever visible.
- Don't block interaction with the screen behind the toast; it is non-modal.
- Don't show toasts from within a bottom sheet — use inline form validation instead.

---

### 2.8 ProgressBar (linear, onboarding steps)

**Purpose:** A step progress indicator in the onboarding flow that communicates how many steps remain; shown at the top of each onboarding screen.

#### Variants

- **step-1** — first step active (1 of 3)
- **step-2** — second step active (2 of 3)
- **step-3** — third step active (3 of 3)

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Step N active | Dot N is filled `primary`; dots N+1…3 are `surfaceVariant` | Screen mounted | — |
| Advancing (N → N+1) | Dot N transitions from `primary` → `secondary` (60 % scale-down then release); dot N+1 transitions `surfaceVariant` → `primary` (scale-up from 0.6 → 1.0) | "Continue" tapped | 200 ms ease-out per dot, staggered 50 ms between dots |
| Regressing (back nav) | Dot N transitions `primary` → `surfaceVariant`; dot N−1 transitions `surfaceVariant` → `primary` | Back pressed | Same animation as advance, reversed |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `totalSteps` | `Int` | `3` | Total number of steps |
| `currentStep` | `Int` | `1` | 1-indexed active step |

#### Behavior Notes

- **Style decision — dots, not a line:** The progress indicator uses **three circular dots**, not a continuous line bar. A dot style is chosen because the three-step flow maps clearly to discrete items, and dots convey discoverability more naturally than a linear fill on a constrained mobile screen.
- **Dot dimensions:** Each dot is **8dp** diameter, circular (50 % corner radius).
- **Active dot color:** `primary` (#10B981 token).
- **Inactive dot color:** `surfaceVariant`.
- **Spacing between dots:** 8dp gap.
- **Row alignment:** Centered horizontally. 16dp top margin below status bar area.
- **Advance animation detail:** Active dot scales from 1.0 → 0.6 over 100 ms (ease-in) then snaps to `secondary` fill color; simultaneously the next dot scales from 0.6 → 1.0 over 200 ms (ease-out) and fills with `primary`. The brief scale-down on the departing dot provides tactile confirmation.
- **Accessibility:** Content description = `"Step $currentStep of $totalSteps"`. Role = `ProgressIndicator`. Increment announced on transition.

#### Do / Don't

**Do:**
- Animate the transition between steps — a static hop feels unresponsive.
- Keep the dots small (8dp) — they are contextual, not primary UI.
- Center the row horizontally under the status bar.

**Don't:**
- Don't use a linear fill bar — dots better reflect the 3-step discrete nature.
- Don't allow the active dot color to differ from `primary`.
- Don't add labels such as "1 / 3" text adjacent to the dots — the count is conveyed by position alone.

---

### 2.9 EmptyState

**Purpose:** A centered, visually encouraging placeholder shown when a screen section has no content to display; prevents blank-screen confusion and directs user action.

#### Variants

- **tracker-empty-day** — no meals planned for the current day in Tracker
- **coach-first-open** — first time the Coach tab is opened, no conversation history
- **stats-no-data** — Stats tab accessed before enough data has been collected

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Mounted | Illustration + text + CTA fade in from 0 → 100 % alpha | Composable enters composition | 300 ms ease-out, 100 ms delay after parent mount |
| CTA pressed | M3 state layer `primary` @ 12 % + slight scale 0.98 → 1.0 | Finger down on CTA | 150 ms |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Enum(TRACKER_EMPTY_DAY, COACH_FIRST_OPEN, STATS_NO_DATA)` | — | Content variant |
| `onPrimaryAction` | `() → Unit` | — | Primary CTA tap callback |
| `onSecondaryAction` | `(() → Unit)?` | `null` | Secondary CTA (tracker-empty-day only) |

#### Behavior Notes

- **Illustration placeholder dimensions:** The illustration area (be it a vector drawable, Lottie, or image placeholder) is **120dp × 120dp**, centered horizontally. It is a placeholder in spec — the actual illustration asset must be provided by the design team. In production, the illustration renders at this fixed size; it does not scale with screen width.
- **Heading + body copy max width:** Both are constrained to a **260dp** maximum width, centered horizontally on screen. They will wrap naturally within this constraint.
- **Heading:** Barlow Condensed Bold, 22sp, color `onSurface`.
- **Body:** Barlow Regular, 14sp, color `onSurfaceVariant`, line height 1.5.
- **CTA button placement:** CTA button(s) are placed **24dp below the body text**, centered. Minimum width: 200dp. Height: 48dp. Corner radius: 12dp.
- **Vertical centering rule:** The entire empty state group (illustration + heading + body + CTA) is **vertically centered** within the available scroll container height, accounting for the top app bar and bottom nav bar. Use `Arrangement.Center` in the parent Column with `Modifier.fillMaxSize()`.

| Variant | Illustration | Heading | Body | Primary CTA | Secondary CTA |
|---|---|---|---|---|---|
| tracker-empty-day | Plate + fork SVG, `primary` | "No meals planned yet." | "Ask your Coach to build a plan, or add meals manually." | "Ask Coach to plan" (filled `primary`, chat icon) | "Add manually" (outlined `cardBorder`, text `onSurfaceVariant`) |
| coach-first-open | Robot / AI SVG, `primary` | "Ready when you are." | "Ask me to plan your meals, log your food, or just tell me what you ate." | — (suggestion chips appear instead, see SuggestionChipRow) | — |
| stats-no-data | Bar chart / graph SVG, `onSurfaceVariant` | "Not enough data yet." | "Track meals for at least 3 days to unlock your monthly insights." | "Go to Tracker" (outlined `primary` border, text `primary`) | — |

- **coach-first-open note:** This variant does not render a CTA button. Instead, the SuggestionChipRow component (see 2.5) is rendered 24dp below the body text in place of a button.

#### Do / Don't

**Do:**
- Vertically center the entire group — never top-align in a half-filled screen.
- Keep body copy concise (≤ 2 lines within the 260dp constraint).
- Use the illustration as an emotional anchor — it must communicate the state visually even without text.

**Don't:**
- Don't use a generic "No content" placeholder for all variants — each variant has bespoke copy and illustration.
- Don't hide the empty state behind a spinner — show it immediately when data is confirmed empty.
- Don't add more than one secondary CTA — secondary action is for the tracker-empty-day variant only.

---

### 2.10 ShimmerSkeleton

**Purpose:** Placeholder loading animation shown in place of real content while data is being fetched; replaces blank screens and communicates that content will appear.

#### Variants

- **meal-row-skeleton** — placeholder for a MealRow list item in Tracker
- **stats-heatmap-skeleton** — placeholder for the discipline heatmap grid in Stats
- **chat-bubble-skeleton** — placeholder for an incoming coach message in the Coach tab

#### States

| State | Visual Change | Trigger | Duration / Animation |
|---|---|---|---|
| Active shimmer | Gradient sweep animates continuously | Composable in composition + data not yet loaded | Infinite loop, 1200 ms per cycle |
| Exiting | Shimmer fades out (alpha 1 → 0); real content fades in (alpha 0 → 1) crossfade | Data loaded | 200 ms cross-fade ease-in-out |

#### Props / Parameters

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `Enum(MEAL_ROW, STATS_HEATMAP, CHAT_BUBBLE)` | — | Skeleton layout |
| `count` | `Int` | `1` | Number of skeleton items (for meal-row-skeleton and chat-bubble-skeleton) |

#### Behavior Notes

- **Shimmer direction:** Left to right (start → end in LTR locale). The animated gradient travels from `shimmerBaseColor` on the left to `shimmerHighlightColor` at the centre, then back to `shimmerBaseColor` on the right.
- **Shimmer speed:** One full sweep cycle = **1200 ms**. Easing: linear (constant velocity sweep). Infinite loop until data loads.
- **Shimmer color values (dark theme — design system dark shimmer spec):**
  - Base color: `surfaceVariant` (`#1E293B` token) — the skeleton block background.
  - Highlight color: `#334155` (`divider` token) — the brighter travelling band.
  - Gradient: `[surfaceVariant, divider, surfaceVariant]` (linear). The highlight band is 30 % of the total gradient width.
- **Placeholder dimensions per variant:**

| Variant | Approximate Dimensions | Internal Structure |
|---|---|---|
| meal-row-skeleton | Full width − 32dp × 72dp, 12dp radius | Left: 20×20dp circle (checkbox placeholder). Center: two horizontal bars (16dp height + 10dp height, 120dp and 80dp widths). Right: three stacked 8dp-height bars (60dp wide). |
| stats-heatmap-skeleton | Matches heatmap grid layout: 30 squares × 28dp each, 4dp gap, 4dp radius each | 5 rows × 6 cols of individual skeleton squares; header bar 140dp × 16dp above grid. |
| chat-bubble-skeleton | Max 220dp wide × 56dp, 12dp radius, left-aligned + 32dp circle (avatar) | Avatar circle left. Two horizontal bars inside bubble: 160dp height 12dp + 100dp height 12dp, 8dp gap. |

- **Multiple instances (list):** When `count > 1`, skeleton items are stacked vertically with the same gap as the real list (8dp for meal rows). Skeletons are rendered in a non-scrollable Column — they are static placeholders.
- **Accessibility:** The entire skeleton area has `contentDescription = "Loading"` and `role = Image` (to prevent screen readers from traversing individual placeholder shapes).
- **Corner radius on all placeholder blocks:** 4dp (consistent with rounded rectangle placeholder aesthetic).

#### Do / Don't

**Do:**
- Match skeleton dimensions precisely to the real component they replace — layout shift on load is a critical UX failure.
- Use only the two shimmer color tokens — never a lighter or white highlight.
- Cross-fade from skeleton to real content (never a hard cut).

**Don't:**
- Don't show skeletons for more than 5 seconds — if data hasn't loaded in 5 s, switch to the EmptyState or Error state.
- Don't animate each skeleton block independently — all blocks in the same composable share one synchronized shimmer offset.
- Don't use a spinner or circular loader instead of the shimmer — shimmer communicates content shape; a spinner does not.
