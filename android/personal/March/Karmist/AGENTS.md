# AGENTS.md

## Project Snapshot
- Android single-module app (`:app`) using Jetpack Compose + Navigation + Room, with Hilt wiring and a Retrofit-backed refresh path.
- Entry path: `AndroidManifest.xml` -> `KarmApp` (`@HiltAndroidApp`) -> `MainActivity` (`@AndroidEntryPoint`) -> `Navigation()`.
- Primary persistence is local SQLite via Room (`karm_db`); remote todos are fetched from `TodoApi` and upserted into the same table.

## Architecture (Read This First)
- Hilt modules live in `app/src/main/java/com/example/karmist/graph/DatabaseModule.kt` and `app/src/main/java/com/example/karmist/graph/RemoteModule.kt`.
- `KarmApp` is the Hilt `Application`, `MainActivity` is the Hilt entry point, and `Navigation()` obtains `KarmViewModel` with `hiltViewModel()`.
- UI talks to `KarmViewModel` (`app/src/main/java/com/example/karmist/viewmodel/KarmViewModel.kt`).
- ViewModel reads from repository Flow and derives `homeUiState` with `combine + debounce(300)`; refresh state is exposed separately through `refreshUiState`.
- `KarmRepository` is injected with `KarmDao` + `TodoApi`; `refreshFromApi()` maps `TodoDto` values through `TodoMapper.toKarm()` before inserting them into Room.
- Data path is `Composable -> ViewModel -> Repository -> DAO/Retrofit -> Room`, and back as Flow/StateFlow.
- Navigation is route-string based in `navigation/Screen.kt` and `navigation/Navigation.kt` (`karm_screen/{id}`).

## Critical Conventions In This Repo
- ViewModel injection is Hilt-driven (`hiltViewModel()` in `Navigation.kt`), not manual `KarmViewModel()` construction.
- Add/edit mode is encoded by `id`: `0L` means create, non-zero means edit (`KarmAddEditScreen.kt`).
- Home list behavior is implemented in UI with Material3 `SwipeToDismissBox` for delete (`HomeScreen.kt`).
- Karm dates are persisted as `Long` epoch millis (`data/entity/Karm.kt`) and formatted in UI (`ui/components/KarmItem.kt`).
- Remote todos are mapped to local `Karm` rows with negative ids in `data/mapper/TodoMapper.kt` to avoid conflicts with auto-generated local ids.
- Table/column names are explicit and mixed-case (`karms_table`, `Description`, `Completion_Status`, `Date`), so SQL name changes need migration care.
- Room schema export is disabled (`exportSchema = false` in `KarmDatabase.kt`), so schema history is not tracked.

## Build, Test, and Debug Workflows
- Verified module layout command:
```bash
cd "/home/mahakaal/Dev/android/personal/March/Karmist"
./gradlew -q projects
```
- Typical local build/test commands for this project:
```bash
cd "/home/mahakaal/Dev/android/personal/March/Karmist"
./gradlew :app:assembleDebug
./gradlew :app:testDebugUnitTest
./gradlew :app:connectedDebugAndroidTest
```
- If Room schema/entity or Hilt/Retrofit wiring changes break builds, inspect `Karm`, `KarmDao`, `KarmDatabase`, `DatabaseModule`, `RemoteModule`, `KarmRepository`, and `KarmViewModel` together before patching UI.

## Integration Points and Change Hotspots
- Data contracts: `data/entity/Karm.kt`, `data/dao/KarmDao.kt`, `data/repository/KarmRepository.kt`, `data/remote/TodoApi.kt`, `data/mapper/TodoMapper.kt`.
- Reactive list behavior: `KarmViewModel.homeUiState` (search/filter/sort pipeline) and `refreshUiState`.
- Navigation argument handling (`id` defaulting to `0L`) in `navigation/Navigation.kt`.
- Screen-level state reset/load behavior in `KarmAddEditScreen.kt` via `LaunchedEffect(karm)`.
- Reusable UI components that impact multiple screens: `ui/components/TopAppBar.kt`, `ui/components/KarmItem.kt`.

## AI Agent Guardrails For This Codebase
- Prefer minimal, localized edits; this codebase uses Hilt only for wiring and still keeps business logic simple.
- When changing persistence fields, update entity + DAO queries + edit/save flow together.
- Keep route strings and argument names aligned between `Screen.kt` and `Navigation.kt`.
- When changing remote sync behavior, update `RemoteModule`, `TodoApi`, `TodoMapper`, `KarmRepository.refreshFromApi()`, and the refresh UI state together.
- Avoid conclusions from `app/build/**`; generated artifacts are present in-repo but not source of truth.
- Existing tests are template-only (`ExampleUnitTest`, `ExampleInstrumentedTest`), so behavior checks rely heavily on app build + manual flow validation.

