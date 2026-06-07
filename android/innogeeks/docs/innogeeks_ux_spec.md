# **UX Specification: Innogeeks Club Management System 2.0**

Source: innogeeks\_app\_prd.md (v2.4)

Target: MVP (Material 3 Implementation)

## **Pass 1: Mental Model**

Primary user intent:

"I want to quickly verify my participation (attendance) and access learning materials without administrative friction."

**Likely misconceptions:**

* **"I need to scan a QR code to mark attendance."** (Legacy behavior from v1.0 / common expectation).  
* **"I can only see resources for my own domain."** (Previous strict isolation model).  
* **"If the internet is down, the app won't work."** (Web-first mental model).

**UX principle to reinforce/correct:**

* **Reinforce:** "The App is the Record." (Offline-first trust).  
* **Correct:** "Attendance is a conversation, not a transaction." (Coordinator marks you; you verify).  
* **Correct:** "Knowledge is open." (Global resource visibility).

## **Pass 2: Information Architecture**

**All user-visible concepts:**

* Attendance %  
* Next Class / Active Session  
* Resource Library (Videos, PDFs, Links)  
* Events (Calendar)  
* User Profile (RegID, Domain, Year)  
* Class History (Coordinator only)  
* Student List (Coordinator only)  
* Admin Config (Core only)

**Grouped structure:**

### **1\. Immediate Utility (Dashboard)**

* **Concept:** Attendance Widget, Next Class, "Log Class" Action (Coordinator).  
* **Rationale:** Users open the app primarily to check status or perform the daily task (attendance).

### **2\. Knowledge Base (Resources)**

* **Concept:** Global Library (All Domains).  
* **Rationale:** Secondary frequency of use, but high dwell time. Needs distinct space for browsing.

### **3\. Community & Identity (Profile/Events)**

* **Concept:** Events, Profile Settings, Delete Account, Admin Tools.  
* **Rationale:** "Meta" tasks. Profile is identity; Events are future-planning.

### **4\. Hidden / Progressive**

* **Concept:** RegID Recovery, Offline Sync Status, "Most Present" Filter.  
* **Rationale:** Only shown when relevant (Login error, Network loss, Attendance taking).

## **Pass 3: Affordances**

| Action | Visual/Interaction Signal |
| :---- | :---- |
| **Log a Class** (Coordinator) | **Extended FAB** with label "Log Class". Highest hierarchy element on screen. |
| **Mark Student Present** | **Toggle Switch**. Mimics a physical checklist. Instant feedback (color change). |
| **Open Resource** | **Card with "External Link" icon**. implies leaving the app context (Custom Tab). |
| **Filter Resources** | **Choice Chips**. Look selectable/toggleable. |
| **Delete Account** | **Red Text / Outlined Button**. Signals danger/destructive action. |
| **Offline Mode** | **Desaturated UI / Banner**. Signals "View Only" or "Local Cache" state. |

**Affordance rules:**

* If user sees a **Student Name**, they should assume it is **Actionable** (Click for details/stats).  
* If user sees a **Domain Tag** (e.g., "ANDROID"), they should assume it is a **Filter**.

## **Pass 4: Cognitive Load**

Friction points:

| Moment | Type | Simplification |

|--------|------|----------------|

| Taking Attendance | Choice/Labor | Default Sort: "Most Present Students" on top. Reduces scrolling for 80% of regulars. |

| Class Setup | Uncertainty ("What topic?") | Suggestion Chips: Show last 3 topics or "General Session" to autocomplete. |

| Login Failure | Uncertainty | Auto-Hint: If email fails, immediately slide up "Enter Reg ID" bottom sheet. Don't make them search for "Help". |

| Resource Browsing | Choice Overload | Default Filter: Select User's Own Domain by default, but allow unselecting to see all. |

**Defaults introduced:**

* **Attendance Filter:** "Most Present" (Rationale: 80/20 rule—same students show up).  
* **Topic Name:** Previous topic \+ " (Cont.)" (Rationale: Classes often span multiple days).

## **Pass 5: State Design**

### **Element: Coordinator Student List**

| State | User Sees | User Understands | User Can Do |
| :---- | :---- | :---- | :---- |
| **Empty** | "No students found in this domain." | No data exists for this domain. | Contact Core Team to add students. |
| **Loading** | Shimmer effect on list rows. | Database is being queried. | Wait (\<1s). |
| **Success** | List of names with toggles. | Class is ready to be logged. | Toggle attendance, Submit. |
| **Partial (Offline)** | List from Local Cache \+ "Offline" Icon. | Data might be stale (new students missing). | Take attendance (will sync later). |
| **Error** | "Sync Failed" Snack bar. | Local save worked, cloud failed. | Retry later; Data is safe locally. |

### **Element: Resource Library**

| State | User Sees | User Understands | User Can Do |
| :---- | :---- | :---- | :---- |
| **Loading** | Shimmer Cards. | Content fetching. | Wait. |
| **Empty** | Illustration: "Library Empty". | No resources uploaded yet. | (If Coord) Upload first resource. |
| **Success** | Grid of Cards. | Content available. | Tap to open. |

## **Pass 6: Flow Integrity**

Flow risks:

| Risk | Where | Mitigation |

|------|-------|------------|

| Accidental Submission | Attendance Screen | "Summary Dialog": "Marking 45 Present. Confirm?" before saving. |

| Alumni Confusion | Dashboard | Alumni View: Hide "Attendance %" (irrelevant). Show "Alumni Network" or "Events" instead. |

| 1st Year Deletion | Profile | Hard Logic: If Year \== 1, the "Delete Account" button is literally not rendered. No "Disabled" state to confuse them. |

| Lost in Resources | Library | "Back to My Domain" sticky button if scrolled far into other domains. |

**Visibility decisions:**

* **Must be visible:** Sync Status (if offline). User's own Domain Tag.  
* **Can be implied:** The year of the student (implied by the list they are in).

**UX constraints:**

* **No Infinite Scroll** for Attendance List (List is finite, \<100). Load all at once for performance.  
* **Offline First:** Never block a "Read" action on a network spinner.

## **Visual Specifications (Material 3\)**

*Only now do we define the look.*

* **Layout:** Standard Scaffold with NavigationBar (Bottom) and TopAppBar.  
* **Navigation:** Floating Pill-shaped Bottom Bar.  
* **Color Mapping:**  
  * **Actionable (FAB/Toggles):** Primary (\#5fd5fe)  
  * **Background:** Neutral (\#121212)  
  * **Destructive:** Error (\#FF3B30)  
* **Typography:**  
  * **Headers:** IBM Plex Sans (Humanist, readable).  
  * **Data/Lists:** IBM Plex Mono (Technical, precise).  
* **Components:**  
  * **Cards:** ElevatedCard for Resources.  
  * **Lists:** ListItem for Attendance.  
  * **Inputs:** OutlinedTextField for forms.  
1. 

