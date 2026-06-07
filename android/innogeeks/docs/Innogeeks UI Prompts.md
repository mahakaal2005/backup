# **Build-Order Prompts: Innogeeks Club Management System 2.0**

## **Overview**

A Material 3 Android application for a university technical club, featuring role-based dashboards, manual attendance tracking, and a global resource library.

## **Build Sequence**

1. **Foundation & Theme** \- Setup Material 3 colors, typography, and shapes.  
2. **App Shell & Navigation** \- Scaffold with Floating Bottom Navigation.  
3. **Authentication Screens** \- Login and Recovery Bottom Sheet.  
4. **Dashboard (Student View)** \- Home screen with attendance widget.  
5. **Coordinator Dashboard** \- Home screen with "Log Class" FAB.  
6. **Attendance Taking Screen** \- List with "Most Present" filter.  
7. **Resource Library** \- Grid layout with domain tabs.

## **Prompt 1: Foundation & Theme**

### **Context**

This is the design foundation for the entire "Innogeeks" Android app. We are using Jetpack Compose with Material 3\.

### **Requirements**

* **Color Palette (Material 3 Tokens):**  
  * Primary: \#5FD5FE (Neon Cyan)  
  * OnPrimary: \#003645  
  * Secondary: \#2FB5E9 (Sky Blue)  
  * Tertiary: \#035C85 (Deep Blue)  
  * Background: \#121212 (Deep Charcoal)  
  * Surface: \#1E1E1E  
  * Error: \#FF3B30  
* **Typography:**  
  * Display/Headlines: IBM Plex Sans (SemiBold)  
  * Body/Labels: IBM Plex Mono (Regular/Medium)  
* **Shapes:** Standard Material 3 rounded corners (CornerRadius 12dp for Cards).

### **States**

* **Dark Mode:** The app is Dark Mode default (using the colors above).

### **Constraints**

* Do not generate full screens yet, just the Theme composable and Color/Type definitions.

## **Prompt 2: App Shell & Navigation**

### **Context**

The main container for the application. It uses a persistent Bottom Navigation Bar that "floats" above the content.

### **Requirements**

* **Container:** Scaffold with a transparent background.  
* **Bottom Bar:**  
  * Component: NavigationBar wrapped in a Surface to give it a "Floating Pill" look.  
  * Styling: Floating 16dp from bottom, 16dp horizontal padding. Fully rounded ends (CircleShape or 50% radius).  
  * Elevation: Tonal Elevation 2\.  
* **Destinations:**  
  1. Home (Icon: Home)  
  2. Resources (Icon: LibraryBooks)  
  3. Events (Icon: CalendarMonth)  
  4. Profile (Icon: Person)  
* **Top Bar:** Simple CenterAlignedTopAppBar showing the screen title.

### **Constraints**

* The Bottom Bar must NOT stretch edge-to-edge. It must look like a floating island.

## **Prompt 3: Authentication Screens**

### **Context**

The entry point of the app. Includes a Login screen and a "Recovery" bottom sheet for users whose email isn't recognized.

### **Requirements**

* **Screen 1: Login**  
  * Layout: Centered column.  
  * Elements:  
    * App Logo (Placeholder Icon for now).  
    * Title: "Welcome to Innogeeks" (Display Font).  
    * Button: "Sign in with Google" (Standard Material Button, full width).  
* **Screen 2: Recovery (Bottom Sheet)**  
  * Trigger: "Forgot ID?" text button or triggered logic.  
  * Title: "Verify Membership".  
  * Input: OutlinedTextField for "Registration ID" (Numeric keyboard).  
  * Action Button: "Verify".

### **States**

* **Input Field:** Normal, Error (Red border if empty), Focused (Primary color).  
* **Loading:** Buttons show circular progress when clicked.

## **Prompt 4: Dashboard (Student View)**

### **Context**

The main landing page for a regular "Member" or "Student". Focuses on their personal stats.

### **Requirements**

* **Hero Card:**  
  * Background: TertiaryContainer.  
  * Content: Large Circular Progress Indicator showing "Attendance %".  
  * Text: "85%" inside the circle. Label "My Attendance".  
* **Next Session Card:**  
  * Title: "Next Class".  
  * Details: "Room 404 • Android Development".  
  * Time: "Today, 4:00 PM".  
* **Layout:** LazyColumn with 16dp padding.

### **Interactions**

* Cards are clickable (Ripple effect) but currently just static displays.

## **Prompt 5: Coordinator Dashboard**

### **Context**

The landing page for a "Coordinator" (Admin). Focuses on management tasks.

### **Requirements**

* **Distinct Feature:** A large "Log Class" FAB.  
  * Component: ExtendedFloatingActionButton.  
  * Icon: Edit or Checklist.  
  * Text: "Log Class".  
  * Location: Bottom End (Standard Scaffold FAB position).  
* **Recent History List:**  
  * Header: "Recent Classes".  
  * Items: List of cards showing "Topic Name" and "Date".

### **Constraints**

* This view REPLACES the Student View when the user role is "Coordinator".

## **Prompt 6: Attendance Taking Screen**

### **Context**

The screen where a Coordinator manually marks students present.

### **Requirements**

* **Header Inputs:**  
  * TextField: "Topic Taught" (Required).  
  * Dropdown: "Select Room".  
* **Filter Row:**  
  * FilterChip: "Most Present" (Selected by default).  
  * FilterChip: "A-Z".  
* **Student List:**  
  * Item Layout: ListItem.  
  * Leading: Avatar (Circle with Initials).  
  * Headline: Student Name (Bold).  
  * Supporting Text: Reg ID (Mono font).  
  * Trailing: Switch (Toggle).  
* **Submit Action:** Floating Action Button "Save".

### **States**

* **Switch:** Checked (Present \- Primary Color), Unchecked (Absent \- Grey).  
* **List Empty:** Text "No students found."

## **Prompt 7: Resource Library**

### **Context**

A global library of learning resources visible to everyone.

### **Requirements**

* **Tabs:** Scrollable TabRow at the top.  
  * Items: "All", "Android", "Web", "ML", "IoT".  
* **Content:** LazyVerticalGrid (2 columns).  
* **Card Item:**  
  * Image: Placeholder Rectangle (Aspect Ratio 16:9).  
  * Title: Resource Name (2 lines max).  
  * Tag: Domain Chip (e.g., "ANDROID") overlaying the image or below title.  
  * Type Icon: Small icon for "Video", "PDF", or "Link".

### **Interactions**

* Tap Card: Triggers an "Open Link" event.