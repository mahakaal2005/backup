# **Product Requirements Document (PRD)**

**Product Name:** Dietify

**Platform:** Native Android (Kotlin / Jetpack Compose)

**Document Status:** Approved

## **1\. Executive Summary**

Dietify is an elite, AI-native meal preparation and macro-tracking application designed for gym-goers and fitness enthusiasts. Unlike traditional static calorie counters, Dietify utilizes a conversational AI Agent (acting as a personal prep coach) to dynamically build, adjust, and track weekly meal plans based on real-time user constraints (macros, lifestyle, and budget). The app combines frictionless multimodal inputs (text, voice, vision) with a sleek, automated tracking dashboard to completely eliminate the cognitive load of dieting.

## **2\. Problem Statement**

* **Friction in Tracking:** Traditional apps require users to manually search for foods, weigh ingredients, and guess macros, leading to high churn rates.  
* **Rigidity of Plans:** Static meal plans break the moment a user goes off-plan (e.g., eating a cheat meal) or faces a real-world constraint (e.g., a tight budget this week).  
* **The Cold Start Problem:** Setting up macro goals in current apps involves tedious, multi-page forms that overwhelm new users.

## **3\. Product Vision & Solution**

**Vision:** To be the most intelligent, frictionless fitness nutrition coach in the world.

**Solution:** A 3-tab native Android application that delegates the complex math and planning to an LLM (Tab 1), while providing the user with a frictionless, highly visual execution checklist (Tab 2\) and progress dashboard (Tab 3).

## **4\. Target Audience**

* **Primary:** Gym-goers and athletes who actively track macros (Protein/Carbs/Fats) but are fatigued by the manual entry required by apps like MyFitnessPal.  
* **Secondary:** Budget-conscious students or young professionals who need to hit fitness goals without overspending on premium groceries.

## **5\. Core App Architecture & User Flow**

Dietify operates on a 2-step onboarding process followed by a 3-tab main shell.

### **5.1 First-Time Setup (The "Flash" Onboarding)**

* **Screen 1 (The Body):** Collects Age, Gender, Weight, and Height via fast sliders.  
* **Screen 2 (The Rules):** Collects Goal (Bulk/Cut/Maintain), Diet Type (Veg/Vegan/Non-Veg), and Allergies via selectable chips.  
* **Optional Account Creation:** After onboarding, users are prompted to create an optional account (via Email, Google, etc.) to enable remote data saving. Users can skip this to remain entirely local.  
* **Handoff:** Data is saved to the local Room Database and formatted into an invisible System Prompt to initialize the AI Coach.

### **5.2 Main Navigation (Bottom Tab Bar)**

* **Tab 1: The AI Coach (Negotiation Hub):** The conversational interface where users plan their week and log complex meals via text, voice, or photos.  
* **Tab 2: The Tracker (Execution Hub):** A Day View (checklist) and Week View (heatmap) that visualizes the approved plan and tracks daily macro completion.  
* **Tab 3: The Stats (Progress Dashboard):** A monthly consistency calendar and weight trend visualization.

## **6\. Functional Requirements**

### **6.1 Tab 1: AI Coach Interactions**

* **Multimodal Input:** The chat interface must support Text (TextField), Voice (SpeechRecognizer), and Image Upload/Capture (CameraX/Photo Picker).  
* **Rich UI Cards:** The AI must not return plain text for meal plans. It must return structured JSON that the app renders as Jetpack Compose interactive cards (e.g., showing a weekly plan summary).  
* **In-Chat Actions:** Plan cards must include \[ ✓ APPROVE PLAN \] and \[ ❌ TWEAK & DECLINE \] buttons.  
* **Vision Auto-Logging:** When a user uploads a food photo, the AI must estimate the macros and provide feedback based on the following scenarios:  
  * **Scenario 1 (Image Only):** If the user uploads a photo without text, the AI provides a macro estimation and discusses the nutritional impact on the daily goal.  
  * **Scenario 2 (Image \+ Text):** If the user uploads a photo with text, the AI uses the text for context (e.g., "I ate this for lunch" vs "Is this healthy?") to automatically log the meal to the tracker or provide specific guidance accordingly.  
* **Dynamic Recalculation:** If a user reports a missed/extra meal, the AI must adjust the remainder of the day's/week's macros to keep the user on target.

### **6.2 Tab 2: The Tracker**

* **Day View (Checklist):** \* Must display circular progress indicators for Calories, Protein, Carbs, and Fats.  
  * Must display a vertical timeline of meals.  
  * Must feature a right-aligned \[ ✓ \] checkbox to log meals with a single tap.  
* **Week View (Heat Map):**  
  * Must display a horizontal or grid layout of the 7-day week.  
  * Cards must be color-coded based on historical success (Green \= Hit Macros, Red \= Missed Macros, Neutral \= Planned/Future).

### **6.3 Tab 3: The Stats**

* **Consistency Score:** A calculated percentage of days the user successfully hit their macro goals.  
* **GitHub-Style Heatmap:** A visual calendar showing green/red squares for daily compliance.  
* **Weight Trend Chart:** A line chart plotting the user's weight changes over the month.

### **6.4 Background Engine & State**

* **Optional User Authentication:** \* Users can choose to create an account to enable Cloud Sync.  
  * If the user chooses not to authenticate, the app remains fully functional using local storage only.  
* **Data Persistence & Sync:** \* **Local Cache:** All UserProfile, MealPlan, and DailyLog data must be stored locally in a Room Database to ensure the app is fully functional offline.  
  * **Cloud Sync (Conditional):** If the user is authenticated, all local data must be synchronized with a remote database. This ensures data is preserved and can be restored if the user uninstalls the app or switches devices.  
* **State Management:** The UI must react instantly to database changes using ViewModel and StateFlow.  
* **API Integration:** The app must communicate with an LLM (Gemini 1.5 Pro / GPT-4o) using Function Calling / Structured Outputs to ensure the AI's responses can be parsed into native UI elements.

## **7\. Non-Functional Requirements**

* **Tech Stack:** Kotlin, Jetpack Compose, Room Database, Retrofit/Ktor.  
* **Performance:** Tab 2 and Tab 3 must load instantly from the local Room DB. AI responses in Tab 1 must show typing/loading indicators while waiting for API resolution.  
* **Privacy:** Food photos and voice notes must be processed ephemerally and not stored permanently on external servers without explicit consent. Local-only mode provides an additional privacy tier for unauthenticated users.

## **8\. Out of Scope for MVP (V1)**

* Real-time grocery price scraping or financial APIs (Budget constraints are handled conversationally by the AI).  
* Social sharing or community leaderboards.  
* Apple Watch / Wear OS companion apps.