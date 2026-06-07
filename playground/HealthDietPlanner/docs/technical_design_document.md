

Technical Design Document (TDD) - Dietify
## 1. System Architecture Overview
Dietify is built using Clean Architecture principles to ensure a separation of concerns and a
robust Offline-First user experience.
## Architectural Layers:
Presentation (UI): Jetpack Compose using Material 3. ViewModels manage UI state via
StateFlow and SharedFlow.
Domain (Business Logic): Use Cases for processing vision logs, handling manual edits,
and negotiating plans with the AI.
Data (Persistence): * Primary: Room Database (Local SQL storage).
Secondary: Firebase Firestore (Optional Cloud Sync for authenticated users).
Network: Retrofit/Ktor for communicating with the Gemini API.
- Database Schema (Room Entities)
UserProfileEntity (User Identity & Constraints)
id: String (Primary Key)
age: Int
weight: Float
height: Float
goal: String (Enum: BULK, CUT, MAINTAIN)
dietType: String (Enum: VEG, NON_VEG, VEGAN)
isCloudSyncEnabled: Boolean
MealPlanEntity (The Planned Roadmap)
id: String (Primary Key)
dayOfWeek: Int (1-7)
title: String (e.g., "Post-Workout Lunch")
scheduledTime: Long
protein: Float
carbs: Float
fats: Float
isLogged: Boolean (Links to DailyLogEntity if completed)
09/03/2026, 00:54Gemini
https://gemini.google.com/gem/1c5e96b13958/b5253854542e99871/3

DailyLogEntity (The Historical Record)
id: String (Primary Key)
timestamp: Long
foodName: String
protein: Float
carbs: Float
fats: Float
calories: Float
imageLocalPath: String? (URI to local photo)
- Multimodal AI Coach Integration
3.1 Function Calling (Tool Use)
The AI Coach is equipped with specific "Tools" to modify the application state:
- update_meal_plan(json): Overwrites the local MealPlanEntity table.
- log_consumed_meal(json): Adds an entry to DailyLogEntity.
- update_biometrics(weight, height): Updates UserProfileEntity.
## 3.2 Vision Logic Pipeline
The app uses the Gemini Vision API capabilities for food recognition:
## Input: Image + Optional Text Prompt.
## Workflow:
- User snaps/uploads a photo.
- App compresses the image and sends it to the API.
- Case A (No Text): AI analyzes the photo and returns a macro estimate + nutritional
commentary.
- Case B (Text: "I ate this"): AI interprets the "consumed" intent, estimates macros, and
triggers the log_consumed_meal function call.
## 4. Manual Overrides & State Sync
To ensure user autonomy, the app allows manual CRUD operations on the tracker.
Manual Edit: A long-press in the Tracker (Tab 2) triggers a ModalBottomSheet that
directly updates Room DB.
Context Awareness: Every time the Chat (Tab 1) is opened, the app feeds the current
Room DB state (including manual changes) into the LLM's system prompt so the Coach is
always "aware."
09/03/2026, 00:54Gemini
https://gemini.google.com/gem/1c5e96b13958/b5253854542e99872/3

## 5. Offline & Synchronization Strategy
Offline Mode: All Tracker and Stats features read/write to Room. Tab 1 shows a
"Reconnection Required" state for the AI.
Sync Logic: If isCloudSyncEnabled is TRUE, a WorkManager task triggers a background
sync with Firestore whenever a network connection is detected.
Conflict Resolution: Last Write Wins (LWW) based on updated_at timestamps on all
entities.
## 6. Performance & Latency
Database: Room queries are performed on background threads via Dispatchers.IO.
AI: Use of "Typing Indicators" and "Partial UI Updates" to manage LLM response latency.
09/03/2026, 00:54Gemini
https://gemini.google.com/gem/1c5e96b13958/b5253854542e99873/3