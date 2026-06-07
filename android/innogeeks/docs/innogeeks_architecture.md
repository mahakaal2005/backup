System Architecture DocumentProject: Innogeeks Club Management System 2.0Version: 3.0 (The "Ultimate Guide" Refactor)Date: 2026-01-14Architecture Pattern: Package-by-Feature (Clean Architecture)1. Architectural StrategyWe are adopting the "Feature-First" Package Structure.Instead of grouping files by what they are (e.g., adapters, viewmodels), we group them by what they do (e.g., auth, attendance).Why this fits the Guide:High Cohesion: Everything related to "Attendance" is in one place.Module-Ready: Each feature package can be pulled out into a separate Gradle module (:feature:attendance) with minimal refactoring later.Discoverability: New developers (or interviewers) can instantly see what features the app has just by looking at the top-level folders.2. The Package Structure (Visualized)This is the exact structure recommended for scalability.com.innogeeks.app
├── core                    # SHARED logic used across multiple features
│   ├── data                # Shared Data infrastructure
│   │   ├── local           # AppDatabase, global TypeConverters
│   │   └── remote          # Firestore instance, Network interceptors
│   ├── domain              # Shared models/utilities
│   │   └── util            # Result<T>, Error types, DateTimeUtils
│   └── presentation        # Shared UI components
│       ├── designsystem    # Theme, Colors, Typography
│       └── components      # InnogeeksButton, LoadingSpinner
│
├── feature                 # DISTINCT functional areas of the app
│   ├── auth                # Feature: Authentication
│   │   ├── data
│   │   │   ├── remote      # AuthRemoteDataSource (Firebase)
│   │   │   ├── repository  # AuthRepositoryImpl
│   │   │   └── mapper      # UserMapper (FirebaseUser -> User)
│   │   ├── domain
│   │   │   ├── model       # User (The clean Entity)
│   │   │   └── repository  # AuthRepository (Interface)
│   │   └── presentation
│   │       ├── login       # LoginScreen, LoginViewModel, LoginState
│   │       └── recovery    # RecoveryScreen, RecoveryViewModel
│   │
│   ├── dashboard           # Feature: Home/Dashboard
│   │   ├── domain          # DashboardRepository (Interface)
│   │   ├── data            # DashboardRepositoryImpl
│   │   └── presentation    # DashboardScreen, DashboardViewModel
│   │
│   ├── attendance          # Feature: Manual Attendance
│   │   ├── domain
│   │   │   ├── model       # Session, Student
│   │   │   └── repository  # AttendanceRepository
│   │   ├── data
│   │   │   ├── local       # SessionDao, StudentDao
│   │   │   ├── remote      # Firestore DTOs
│   │   │   └── repository  # AttendanceRepositoryImpl
│   │   └── presentation
│   │       ├── list        # AttendanceListScreen
│   │       └── log_class   # LogClassScreen
│   │
│   └── resources           # Feature: Global Resource Library
│       ├── ... (domain, data, presentation)
│
├── InnogeeksApp.kt         # Application Class (Hilt Entry Point)
└── MainActivity.kt         # Single Activity
3. Layer Details (Inside a Feature)Each feature package mimics a Clean Architecture layering:3.1 Domain Layer (feature/xyz/domain)The Rules: Pure Kotlin. No Android dependencies (except maybe @Parcelize).Contents:model: Data classes used by the UI (e.g., Student).repository: Interfaces defining what data we need (e.g., AttendanceRepository).(Optional) usecase: Single-purpose business logic (e.g., CalculateAttendanceStatsUseCase).3.2 Data Layer (feature/xyz/data)The Rules: Implements the Domain interfaces. Talks to core/data.Contents:repository: The class implementing the Domain interface (e.g., AttendanceRepositoryImpl).remote: DTOs (Data Transfer Objects) matching Firestore JSON.mapper: Extension functions to convert Dto -> DomainModel and Entity -> DomainModel.3.3 Presentation Layer (feature/xyz/presentation)The Rules: Jetpack Compose + ViewModels.Contents:Screen: The Composable.ViewModel: Manages State.State: Data class defining the UI State (e.g., LoginState).4. Data Flow (The "Ultimate" Pattern)Core Setup: :core:data provides the RoomDatabase instance.Feature Access: AttendanceRepositoryImpl (in feature/attendance/data) asks AppDatabase (in core) for the AttendanceDao.Mapping: The Repository gets SessionEntity from Room, maps it to Session (Domain model), and emits it to the ViewModel.5. Dependency Injection (Hilt)We will use Hilt Modules to glue this together.CoreModule: Provides singletons (@Singleton) like FirebaseFirestore, AppDatabase.FeatureModules: Each feature has its own module (e.g., AuthModule) that binds the Repository Implementation to the Interface.@Module
@InstallIn(SingletonComponent::class)
abstract class AuthModule {
    @Binds
    abstract fun bindAuthRepository(
        impl: AuthRepositoryImpl
    ): AuthRepository
}
6. Testing StrategyThis structure makes testing incredibly easy:Unit Test: You can test feature/auth/domain logic without knowing anything about the Database.Integration Test: You can swap AuthRepository with a FakeAuthRepository in the presentation layer to test the UI.