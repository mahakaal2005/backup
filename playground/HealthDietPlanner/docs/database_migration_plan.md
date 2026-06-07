# Dietify — Database Migration Plan

> **Write before the first Room DB entity is committed.**  
> Last updated: 2026-03-25

---

## 1. Migration Philosophy

Room Database is the single source of truth for all user data in Dietify. Every meal plan, every logged entry, every weight measurement is irreplaceable personal history — and a user who loses their meal history is a churned user. Unlike a cache that can be repopulated from a server, local nutrition logs represent lived experience that cannot be reconstructed. For this reason, **we never use `fallbackToDestructiveMigration()` in production builds.** Destructive migration silently wipes all user tables on a schema version upgrade, trading weeks of logged data for a clean install state. Every schema change, no matter how minor, must ship with an explicit `Migration` object that transforms the old schema to the new one safely. The only exception is the `debug` build flavor during early development, and this exception must be explicitly annotated and removed before any beta release.

---

## 2. Schema v1 — Baseline

### Database Configuration

```kotlin
@Database(
    entities = [UserProfileEntity::class, MealPlanEntity::class, DailyLogEntity::class],
    version = 1,
    exportSchema = true   // Always true — schema JSON files must be committed to VCS
)
abstract class DietifyDatabase : RoomDatabase() {
    abstract fun userProfileDao(): UserProfileDao
    abstract fun mealPlanDao(): MealPlanDao
    abstract fun dailyLogDao(): DailyLogDao
}
```

> **Rule:** `exportSchema = true` is mandatory. The generated `/schemas/` JSON files are the ground truth for migration testing and must never be `.gitignore`d.

---

### 2.1 `UserProfileEntity`

**Entity Definition**

```kotlin
@Entity(tableName = "user_profile")
data class UserProfileEntity(
    @PrimaryKey val id: String,          // UUID, generated on first launch
    val age: Int,
    val weight: Float,                   // kg
    val height: Float,                   // cm
    val goal: String,                    // Enum: BULK | CUT | MAINTAIN
    val dietType: String,                // Enum: VEG | NON_VEG | VEGAN
    val isCloudSyncEnabled: Boolean,
    val updatedAt: Long                  // epoch millis — LWW conflict key
)
```

**SQL `CREATE TABLE` (Room-generated)**

```sql
CREATE TABLE IF NOT EXISTS `user_profile` (
    `id`                  TEXT    NOT NULL,
    `age`                 INTEGER NOT NULL,
    `weight`              REAL    NOT NULL,
    `height`              REAL    NOT NULL,
    `goal`                TEXT    NOT NULL,
    `dietType`            TEXT    NOT NULL,
    `isCloudSyncEnabled`  INTEGER NOT NULL,
    `updatedAt`           INTEGER NOT NULL,
    PRIMARY KEY(`id`)
);
```

**Indexes**

| Column | Index Type | Reason |
|---|---|---|
| `id` | Primary Key (implicit) | Singleton table — one row per device |
| `updatedAt` | Single-column index | Fast conflict resolution during cloud sync |

```sql
CREATE INDEX IF NOT EXISTS `index_user_profile_updatedAt` ON `user_profile` (`updatedAt`);
```

**Recommended Query Patterns (DAO)**

```kotlin
@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profile LIMIT 1")
    fun getProfile(): Flow<UserProfileEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(profile: UserProfileEntity)

    @Query("UPDATE user_profile SET updatedAt = :ts WHERE id = :id")
    suspend fun touchTimestamp(id: String, ts: Long)

    @Query("SELECT updatedAt FROM user_profile WHERE id = :id")
    suspend fun getUpdatedAt(id: String): Long?
}
```

---

### 2.2 `MealPlanEntity`

**Entity Definition**

```kotlin
@Entity(
    tableName = "meal_plan",
    indices = [Index("dayOfWeek"), Index("scheduledTime"), Index("updatedAt")]
)
data class MealPlanEntity(
    @PrimaryKey val id: String,          // UUID — stable across edits
    val dayOfWeek: Int,                  // 1 = Monday … 7 = Sunday
    val title: String,                   // e.g., "Post-Workout Lunch"
    val scheduledTime: Long,             // epoch millis of intended meal time
    val protein: Float,                  // grams
    val carbs: Float,                    // grams
    val fats: Float,                     // grams
    val isLogged: Boolean,               // true when mirrored in DailyLogEntity
    val updatedAt: Long                  // epoch millis — LWW conflict key
)
```

**SQL `CREATE TABLE`**

```sql
CREATE TABLE IF NOT EXISTS `meal_plan` (
    `id`            TEXT    NOT NULL,
    `dayOfWeek`     INTEGER NOT NULL,
    `title`         TEXT    NOT NULL,
    `scheduledTime` INTEGER NOT NULL,
    `protein`       REAL    NOT NULL,
    `carbs`         REAL    NOT NULL,
    `fats`          REAL    NOT NULL,
    `isLogged`      INTEGER NOT NULL,
    `updatedAt`     INTEGER NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE INDEX IF NOT EXISTS `index_meal_plan_dayOfWeek`     ON `meal_plan` (`dayOfWeek`);
CREATE INDEX IF NOT EXISTS `index_meal_plan_scheduledTime` ON `meal_plan` (`scheduledTime`);
CREATE INDEX IF NOT EXISTS `index_meal_plan_updatedAt`     ON `meal_plan` (`updatedAt`);
```

**Recommended Query Patterns**

```kotlin
@Dao
interface MealPlanDao {
    // Tracker: all meals for today
    @Query("SELECT * FROM meal_plan WHERE dayOfWeek = :day ORDER BY scheduledTime ASC")
    fun getMealsForDay(day: Int): Flow<List<MealPlanEntity>>

    // AI tool: replace entire plan atomically
    @Transaction
    suspend fun replacePlan(newPlan: List<MealPlanEntity>) {
        deleteAll()
        insertAll(newPlan)
    }

    @Query("DELETE FROM meal_plan")
    suspend fun deleteAll()

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(meals: List<MealPlanEntity>)

    // Mark a meal as logged
    @Query("UPDATE meal_plan SET isLogged = 1, updatedAt = :ts WHERE id = :id")
    suspend fun markLogged(id: String, ts: Long)

    // Sync: fetch rows modified after last sync
    @Query("SELECT * FROM meal_plan WHERE updatedAt > :since")
    suspend fun getModifiedSince(since: Long): List<MealPlanEntity>
}
```

---

### 2.3 `DailyLogEntity`

**Entity Definition**

```kotlin
@Entity(
    tableName = "daily_log",
    indices = [Index("timestamp"), Index("updatedAt")]
)
data class DailyLogEntity(
    @PrimaryKey val id: String,          // UUID
    val timestamp: Long,                 // epoch millis of actual consumption
    val foodName: String,
    val protein: Float,                  // grams
    val carbs: Float,                    // grams
    val fats: Float,                     // grams
    val calories: Float,                 // kcal
    val imageLocalPath: String?,         // nullable URI to cached local photo
    val updatedAt: Long                  // epoch millis — LWW conflict key
)
```

**SQL `CREATE TABLE`**

```sql
CREATE TABLE IF NOT EXISTS `daily_log` (
    `id`             TEXT    NOT NULL,
    `timestamp`      INTEGER NOT NULL,
    `foodName`       TEXT    NOT NULL,
    `protein`        REAL    NOT NULL,
    `carbs`          REAL    NOT NULL,
    `fats`           REAL    NOT NULL,
    `calories`       REAL    NOT NULL,
    `imageLocalPath` TEXT,
    `updatedAt`      INTEGER NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE INDEX IF NOT EXISTS `index_daily_log_timestamp`  ON `daily_log` (`timestamp`);
CREATE INDEX IF NOT EXISTS `index_daily_log_updatedAt`  ON `daily_log` (`updatedAt`);
```

**Recommended Query Patterns**

```kotlin
@Dao
interface DailyLogDao {
    // Stats: logs within a date range (e.g., past 7 days)
    @Query("""
        SELECT * FROM daily_log
        WHERE timestamp BETWEEN :startMs AND :endMs
        ORDER BY timestamp DESC
    """)
    fun getLogsInRange(startMs: Long, endMs: Long): Flow<List<DailyLogEntity>>

    // Tracker: today's macro totals
    @Query("""
        SELECT SUM(calories) AS calories, SUM(protein) AS protein,
               SUM(carbs) AS carbs, SUM(fats) AS fats
        FROM daily_log
        WHERE timestamp BETWEEN :dayStartMs AND :dayEndMs
    """)
    fun getDailyTotals(dayStartMs: Long, dayEndMs: Long): Flow<MacroTotals?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entry: DailyLogEntity)

    // Sync: fetch rows modified after last sync
    @Query("SELECT * FROM daily_log WHERE updatedAt > :since")
    suspend fun getModifiedSince(since: Long): List<DailyLogEntity>
}
```

---

## 3. Anticipated v2 Changes

### 3.1 Add Allergy Fields to `UserProfileEntity`

**Description:** Store allergy constraints directly on the profile for fast retrieval during AI prompt construction.

**SQL Migration**

```sql
-- Migration 1 → 2 (add allergies column)
ALTER TABLE `user_profile` ADD COLUMN `allergies` TEXT NOT NULL DEFAULT '';
```

**Room `@Migration` Class**

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL(
            "ALTER TABLE `user_profile` ADD COLUMN `allergies` TEXT NOT NULL DEFAULT ''"
        )
    }
}
```

**Risk Assessment**

| Category | Detail |
|---|---|
| Data loss risk | **No** |
| Mitigation | `NOT NULL DEFAULT ''` ensures existing rows are valid immediately; empty string = no allergies |
| Idempotent? | **Yes** — `ADD COLUMN` is a no-op if rerun on a schema that already has the column (test harness only; Room version guard prevents double-run in prod) |

---

### 3.2 Add `imageLocalPath` to `MealPlanEntity`

**Description:** Allow planned meals to reference a user-saved reference photo.

**SQL Migration**

```sql
-- Migration 2 → 3
ALTER TABLE `meal_plan` ADD COLUMN `imageLocalPath` TEXT;
```

**Room `@Migration` Class**

```kotlin
val MIGRATION_2_3 = object : Migration(2, 3) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL(
            "ALTER TABLE `meal_plan` ADD COLUMN `imageLocalPath` TEXT"
        )
    }
}
```

**Risk Assessment**

| Category | Detail |
|---|---|
| Data loss risk | **No** |
| Mitigation | Nullable column — existing rows silently receive `NULL` |

---

### 3.3 Add `StreakEntity` Table

**Description:** New table tracking daily consecutive logging streaks for the Stats screen heatmap.

**SQL Migration**

```sql
-- Migration 3 → 4
CREATE TABLE IF NOT EXISTS `streak` (
    `id`          TEXT    NOT NULL,
    `date`        INTEGER NOT NULL,   -- epoch millis of the day (midnight UTC)
    `isComplete`  INTEGER NOT NULL,   -- 1 = all meals logged that day
    `updatedAt`   INTEGER NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE INDEX IF NOT EXISTS `index_streak_date` ON `streak` (`date`);
```

**Room `@Migration` Class**

```kotlin
val MIGRATION_3_4 = object : Migration(3, 4) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS `streak` (
                `id`         TEXT    NOT NULL,
                `date`       INTEGER NOT NULL,
                `isComplete` INTEGER NOT NULL,
                `updatedAt`  INTEGER NOT NULL,
                PRIMARY KEY(`id`)
            )
        """.trimIndent())
        db.execSQL("CREATE INDEX IF NOT EXISTS `index_streak_date` ON `streak` (`date`)")
    }
}
```

**Risk Assessment**

| Category | Detail |
|---|---|
| Data loss risk | **No** |
| Mitigation | Net-new table — zero impact on existing tables |

---

### 3.4 Add `WeightLogEntity` Table

**Description:** Dedicated table for the weight trend chart on the Stats screen.

**SQL Migration**

```sql
-- Migration 4 → 5
CREATE TABLE IF NOT EXISTS `weight_log` (
    `id`          TEXT    NOT NULL,
    `weightKg`    REAL    NOT NULL,
    `timestamp`   INTEGER NOT NULL,   -- epoch millis of measurement
    `updatedAt`   INTEGER NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE INDEX IF NOT EXISTS `index_weight_log_timestamp` ON `weight_log` (`timestamp`);
```

**Room `@Migration` Class**

```kotlin
val MIGRATION_4_5 = object : Migration(4, 5) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE IF NOT EXISTS `weight_log` (
                `id`        TEXT    NOT NULL,
                `weightKg`  REAL    NOT NULL,
                `timestamp` INTEGER NOT NULL,
                `updatedAt` INTEGER NOT NULL,
                PRIMARY KEY(`id`)
            )
        """.trimIndent())
        db.execSQL(
            "CREATE INDEX IF NOT EXISTS `index_weight_log_timestamp` ON `weight_log` (`timestamp`)"
        )
    }
}
```

**Risk Assessment**

| Category | Detail |
|---|---|
| Data loss risk | **No** |
| Mitigation | Net-new table |

---

### 3.5 Add `updatedAt` to All Entities (LWW Prerequisite)

> **Note:** The v1 schema already includes `updatedAt` on all three entities per this plan. This migration entry is documented for teams that shipped v1 without it and need a remediation path.

**SQL Migration (remediation only)**

```sql
-- Only run if updatedAt is missing from a pre-plan v1 schema
ALTER TABLE `user_profile` ADD COLUMN `updatedAt` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `meal_plan`    ADD COLUMN `updatedAt` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `daily_log`    ADD COLUMN `updatedAt` INTEGER NOT NULL DEFAULT 0;
```

**Risk Assessment**

| Category | Detail |
|---|---|
| Data loss risk | **No** |
| Mitigation | `DEFAULT 0` means existing rows will sync as "oldest possible" and will be overwritten by any valid cloud record on first sync — intentional and safe |

---

## 4. Migration Infrastructure Pattern

### 4.1 File Naming Convention

```
migrations/
│
├── m_001_to_002_add_allergies.sql          # Raw SQL for review/auditing
├── m_002_to_003_add_meal_image.sql
├── m_003_to_004_add_streak_table.sql
└── m_004_to_005_add_weight_log_table.sql
```

Pattern: `m_{fromVersion:03d}_to_{toVersion:03d}_{snake_case_description}.sql`

### 4.2 Project Structure

```
app/src/main/java/com/dietify/
│
├── data/
│   ├── local/
│   │   ├── db/
│   │   │   ├── DietifyDatabase.kt          # @Database, version declaration
│   │   │   └── migrations/
│   │   │       ├── Migration_1_2.kt
│   │   │       ├── Migration_2_3.kt
│   │   │       └── Migration_3_4.kt
│   │   ├── dao/
│   │   │   ├── UserProfileDao.kt
│   │   │   ├── MealPlanDao.kt
│   │   │   └── DailyLogDao.kt
│   │   └── entity/
│   │       ├── UserProfileEntity.kt
│   │       ├── MealPlanEntity.kt
│   │       └── DailyLogEntity.kt
│
app/schemas/
└── com.dietify.data.local.db.DietifyDatabase/
    ├── 1.json          # Auto-exported by Room — commit to VCS
    ├── 2.json
    └── 3.json
```

**Database builder registration (always register all migrations):**

```kotlin
Room.databaseBuilder(context, DietifyDatabase::class.java, "dietify.db")
    .addMigrations(
        MIGRATION_1_2,
        MIGRATION_2_3,
        MIGRATION_3_4,
        MIGRATION_4_5
    )
    // .fallbackToDestructiveMigration()  ← NEVER uncomment in production
    .build()
```

### 4.3 Testing Migrations — `MigrationTestHelper` Pattern

Add the following dependency to `build.gradle (app)`:

```kotlin
androidTestImplementation("androidx.room:room-testing:$room_version")
```

**Migration test template:**

```kotlin
@RunWith(AndroidJUnit4::class)
class MigrationTest {

    @get:Rule
    val helper = MigrationTestHelper(
        instrumentation     = InstrumentationRegistry.getInstrumentation(),
        databaseClass       = DietifyDatabase::class.java,
        specs               = emptyList()
    )

    @Test
    fun migrate1To2_addsAllergiesColumn() {
        // 1. Create DB at version 1
        helper.createDatabase(TEST_DB_NAME, 1).apply {
            execSQL(
                "INSERT INTO user_profile VALUES('user-001', 25, 75.0, 180.0, 'BULK', 'NON_VEG', 1, ${System.currentTimeMillis()})"
            )
            close()
        }

        // 2. Re-open with migration
        val db = helper.runMigrationsAndValidate(TEST_DB_NAME, 2, true, MIGRATION_1_2)

        // 3. Verify column exists and existing row has default value
        val cursor = db.query("SELECT allergies FROM user_profile WHERE id = 'user-001'")
        assertTrue(cursor.moveToFirst())
        assertEquals("", cursor.getString(0))
        cursor.close()
    }

    companion object {
        private const val TEST_DB_NAME = "migration-test"
    }
}
```

**Rules for migration tests:**
1. Every `Migration` object must have a corresponding `@Test`.
2. Tests must seed data in the old schema and assert it survives the migration.
3. `runMigrationsAndValidate` validates against the exported schema JSON — this is why `exportSchema = true` is mandatory.

### 4.4 Pre-Packaged Database Strategy

**Decision: Empty DB on first launch (no pre-seeded data).**

Rationale:
- Dietify's v1 AI tool `update_meal_plan` generates a fully personalised meal plan after onboarding. Pre-seeding a generic plan would be immediately overwritten.
- A pre-packaged DB asset must be versioned and shipped inside the APK, increasing binary size with no user benefit.
- The seeding responsibility belongs to the AI coach on first launch, not the database layer.

**Implementation:** If a future version requires seeding (e.g., a library of 200 common foods), use Room's `createFromAsset()` builder option and ship a versioned `dietify_seed_v1.db` file in `assets/`.

---

## 5. Conflict Resolution (Cloud Sync)

### 5.1 Which Entities Need `updatedAt`

**All entities.** No exceptions.

| Entity | `updatedAt` Field | Sync Direction |
|---|---|---|
| `UserProfileEntity` | `updatedAt: Long` | Bidirectional |
| `MealPlanEntity` | `updatedAt: Long` | Bidirectional |
| `DailyLogEntity` | `updatedAt: Long` | Bidirectional |
| `StreakEntity` (v2) | `updatedAt: Long` | Bidirectional |
| `WeightLogEntity` (v2) | `updatedAt: Long` | Bidirectional |

### 5.2 Data Type and Format for `updatedAt`

| Property | Value |
|---|---|
| **Kotlin type** | `Long` |
| **Unit** | Unix epoch milliseconds (UTC) |
| **Source** | `System.currentTimeMillis()` at write time |
| **Example** | `1743000000000` |
| **Never use** | `LocalDateTime`, `Date`, or any timezone-local format |

**Setting `updatedAt` — always at the Repository layer, never at the DAO or ViewModel layer:**

```kotlin
suspend fun upsertProfile(profile: UserProfileEntity) {
    val stamped = profile.copy(updatedAt = System.currentTimeMillis())
    dao.upsert(stamped)
    if (profile.isCloudSyncEnabled) syncQueue.enqueue(stamped)
}
```

### 5.3 Conflict Resolution Logic (Pseudocode)

```
function resolveConflict(localRecord, remoteRecord):

    if localRecord is null:
        // Remote has data, local does not — accept remote
        return ACCEPT_REMOTE

    if remoteRecord is null:
        // Local has data, remote does not — keep local (will upload on next sync)
        return KEEP_LOCAL

    if remoteRecord.updatedAt > localRecord.updatedAt:
        // Remote is newer — overwrite local
        writeToRoom(remoteRecord)
        return ACCEPT_REMOTE

    if localRecord.updatedAt > remoteRecord.updatedAt:
        // Local is newer — overwrite remote
        writeToFirestore(localRecord)
        return KEEP_LOCAL

    if localRecord.updatedAt == remoteRecord.updatedAt:
        // Tie — see Section 5.4
        return RESOLVE_TIE(localRecord, remoteRecord)
```

**WorkManager sync job flow:**

```
1. Fetch all local records modified since lastSyncTimestamp
2. Fetch all remote records modified since lastSyncTimestamp
3. For each record in UNION(local_ids, remote_ids):
       resolveConflict(local[id], remote[id])
4. Update lastSyncTimestamp = System.currentTimeMillis()
5. Persist lastSyncTimestamp in DataStore (not Room)
```

### 5.4 Edge Case: Identical `updatedAt` Timestamps

When `localRecord.updatedAt == remoteRecord.updatedAt`, a true simultaneous write has occurred (extremely rare but possible if two devices write within the same millisecond or clocks are perfectly in sync).

**Resolution rule: Remote wins on tie.**

```kotlin
if (localRecord.updatedAt == remoteRecord.updatedAt) {
    // Remote wins — deterministic, consistent across all devices
    writeToRoom(remoteRecord)
    // Do NOT upload local to remote (it is identical in timestamp)
    log("LWW TIE: remote accepted for entity ${remoteRecord.id}")
}
```

**Rationale:** "Remote wins on tie" is deterministic and consistent — every device applying this rule independently converges to the same state. The alternative (local wins) would cause a ping-pong overwrite loop across devices.

> **Note:** The `UserProfileEntity` is a singleton (one row). `DailyLogEntity` rows are immutable after creation (new entries are inserts, not updates). Therefore, true tie conditions are most likely to occur on `MealPlanEntity` during rapid AI-driven plan regeneration and should be monitored in production logs.

---

*End of Dietify Database Migration Plan*
