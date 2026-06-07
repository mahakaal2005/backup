# **User Flow & Screen Specifications**

Project: Innogeeks Club Management System 2.0  
Version: 1.0  
Date: 2026-01-06  
Status: Draft

## **1\. Global Navigation Structure**

The app utilizes a **Bottom Navigation Bar** that persists across top-level destinations.

* **Items:** Home 🏠 | Resources 📚 | Scan/Action ⚡ (FAB) | Events 📅 | Profile 👤  
* **Behavior:** The 'Scan/Action' button is a prominent Floating Action Button (FAB) docked in the center.

## **2\. Flow: Authentication (All Users)**

*The 'Golden List' Entry.*

### **Screen 1.0: Splash Screen**

* **Visual:** Animated Innogeeks Logo (Neon Cyan glow) on deep charcoal background.  
* **Action:** Auto-transition (1.5s) to Auth Screen.

### **Screen 1.1: Login**

* **Visual:** Minimalist glass card centered.  
* **Elements:**  
  * Logo & "Welcome to Innogeeks".  
  * Button: "Sign in with Google" (Standard G-Suite branding).  
* **Logic:**  
  * **Success (Email Match):** Go to Home Dashboard (Role-specific).  
  * **Failure (Email Mismatch):** Go to Screen 1.2.

### **Screen 1.2: Identity Verification (The Recovery Flow)**

* **Visual:** Modal sheet slides up with a blurred background.  
* **Text:** "We couldn't find your email. Are you a registered member?"  
* **Input:** "Enter your University Registration ID" (Numeric Keypad).  
* **Action:** Tap "Verify".  
* **Feedback:**  
  * **Found:** Show Hint Card: *"Identity Verified. Please log in with r*\*\*\*\**l@college.edu"*. User taps "Retry Login".  
  * **Not Found:** Show Button: *"Continue as Guest"*.

## **3\. Flow: Student (Member) Journey**

### **Screen 2.0: Student Dashboard (The Cockpit)**

* **Top Bar:** "Hello,$$Name$$  
  " \+ Notification Bell.  
* **Widget 1 (Attendance):** Large Circular Progress Bar (e.g., "85%"). Center text: "Android Domain".  
* **Widget 2 (Next Event):** Card showing "Intro to Jetpack Compose" | "Room 304" | "Starts in 2h".  
* **Widget 3 (Recent Resources):** Horizontal scroll of latest 3 PDF/Link cards.

### **Screen 2.1: Scan Attendance (The Core Action)**

* **Trigger:** Tap Center FAB (⚡).  
* **Visual:** Full-screen Camera Viewfinder with a "Scanning..." overlay.  
* **Action:** Camera detects QR Code.  
* **Feedback:**  
  * **Success:** Haptic Vibration \+ "Success" Animation (Green Checkmark) \+ "Marked Present\!". Auto-close to Home.  
  * **Error:** "Invalid/Expired QR" or "You are too far from the venue" (Geo-fence error).

### **Screen 2.2: Resource Library**

* **Tab Bar:** Filter by Type (All, PDFs, Videos, GitHub).  
* **List:** Vertical list of **Glass Cards**.  
  * *Card Content:* Thumbnail, Title, Domain Tag (\#Android), "Added by$$Name$$  
    ".  
* **Action:** Tap Card → Opens link in **Chrome Custom Tab** (In-app browser).

## **4\. Flow: Coordinator Journey**

### **Screen 3.0: Coordinator Dashboard**

* **Widget 1 (Live Session):**  
  * *State Idle:* Button "Start Attendance Session".  
  * *State Active:* pulsing "Live" indicator \+ Count "24 Students Present".  
* **Widget 2 (Pending Actions):** "3 Absence Requests Pending".  
* **Widget 3 (My Domain):** "Android Domain Stats".

### **Screen 3.1: Active Session (QR Projector)**

* **Trigger:** Tap "Start Attendance Session".  
* **Visual:**  
  * Large **QR Code** in center (re-generates animation every 5s).  
  * Bottom Sheet: List of students who just scanned in (Real-time stream).  
* **Action:** Tap "End Session" → Saves logs → Returns to Home.

### **Screen 3.2: Broadcast Composer**

* **Trigger:** Profile \-\> "Send Broadcast".  
* **Form:**  
  * **Target:** Dropdown (My Domain Students, Other Coordinators).  
  * **Message:** Text Area.  
  * **Priority:** Toggle (Normal / High Urgent).  
* **Action:** Swipe to Send.

## **5\. Flow: Core Team Journey**

### **Screen 4.0: Super Admin Dashboard**

* **Widget 1 (Club Health):** Total Members | Total Active Today.  
* **Widget 2 (Domain Overview):** Bar chart comparing attendance across Android, Web, ML, etc.  
* **Widget 3 (System Status):** Firebase Connection | Storage Quota.

### **Screen 4.1: User Management**

* **List:** Searchable list of all users.  
* **Action:** Tap User → Edit Role/Domain (Fix typos or promote members).  
* **Floating Action:** "Upload Excel" (Imports new batch).

## **6\. Edge Case Screens**

* **Offline Mode:** Top banner: *"Offline Mode \- Showing cached data"*.  
* **Access Denied:** (If a Web student tries to open an Android deep link) \-\> "Access Restricted to Android Domain".