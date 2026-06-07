# Plan: Innogeeks Club Management System 2.0 — MVP Implementation

A Feature-First Clean Architecture Android app with Material 3, offline-first storage (Room + Firestore), role-based dashboards, manual attendance tracking, and a global resource library.

## Steps

1. **Set up Project Foundation & Dependencies** — Add Hilt, Navigation Compose, Room, Firebase (Auth, Firestore, FCM), Coil, and Chrome Custom Tabs to `gradle/libs.versions.toml` and `app/build.gradle.kts`. Create package structure: `core/`, `feature/auth/`, `feature/dashboard/`, `feature/attendance/`, `feature/resources/`.

2. **Implement Design System (Theme)** — Replace default colors in `Color.kt` with Innogeeks palette (#5FD5FE, #2FB5E9, #035C85, #121212). Add IBM Plex Sans/Mono fonts to `Type.kt`. Configure dark-mode-only theme in `Theme.kt`.

3. **Build App Shell & Floating Navigation** — Create `InnogeeksApp` composable in `core/presentation/` with a Scaffold + floating pill-shaped `NavigationBar` (Home, Resources, Events, Profile) and `NavHost` for navigation. Wire to `MainActivity.kt`.

4. **Implement Authentication Feature** — Create `feature/auth/` with: `AuthRepository` (interface + Firestore/Firebase Auth impl), `User` domain model, `LoginScreen`, `RecoveryBottomSheet`, and `LoginViewModel`. Implement "Golden List" logic: Google Sign-In → email check → RegID recovery → Guest fallback.

5. **Build Role-Based Dashboards** — Create `feature/dashboard/` with: `StudentDashboardScreen` (attendance %, next session), `CoordinatorDashboardScreen` (Log Class FAB, recent classes), and `CoreTeamDashboardScreen` (club health, domain stats). Route based on `User.role` after login.

6. **Implement Attendance Feature** — Create `feature/attendance/` with: `Session`, `Student` models, `AttendanceRepository`, Room DAOs, `LogClassScreen` (topic input + student list with toggles), and "Most Present" sorting. Add confirmation dialog before saving.

7. **Build Resource Library** — Create `feature/resources/` with: `Resource` model, `ResourceRepository`, `ResourceLibraryScreen` (TabRow for domains + LazyVerticalGrid of cards). Open links via Chrome Custom Tabs.

## Further Considerations

1. **Package Naming** — Current package is `com.example.innogeeks_app`. Should we refactor to `com.innogeeks.app` to match the architecture doc?
2. **Firebase Setup** — Have you created a Firebase project and downloaded `google-services.json`? This is required before the Auth feature can run.
3. **Font Assets** — Should IBM Plex Sans/Mono be bundled as `.ttf` files, or use Google Fonts dynamically?

