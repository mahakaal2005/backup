# **Innogeeks MVP Scope Reference**

Source of Truth: innogeeks\_app\_prd.md (Version 2.4)  
Build Target: MVP (Minimum Viable Product)

## **1\. Functional Scope References**

| Feature Area | PRD Section | MVP Implementation Scope |
| :---- | :---- | :---- |
| **Authentication** | **\[Section 2.1\]** | Full "Golden List" logic: Google Sign-In, RegID Verification, Guest fallback. |
| **User Roles** | **\[Section 2.2\]** | Implement all 5 roles: **Core, Coordinator, Member, Alumni, Guest**. |
| **Dashboard** | **\[Section 3.1\]** | Role-specific views with **Floating Bottom Navigation**. |
| **Attendance** | **\[Section 3.2\]** | **Manual Tracking Only**. Include "Topic" input and "Most Present" sort filter. |
| **Resources** | **\[Section 3.3\]** | **Global Access**. All users see all domains. Chrome Custom Tabs for links. |
| **Broadcasts** | **\[Section 3.4\]** | Firebase Cloud Messaging (FCM) for targeted notifications. |
| **Profile** | **\[Section 3.5\]** | **Delete Account** button (Hidden for 1st Year students). |

## **2\. MVP Specific Implementation Details**

* **Guest & Alumni Content:** \* Initial content (Welcome messages, Event archives) will be **hardcoded** strings in the client or simple Firestore documents.  
  * **Update Mechanism:** Exposed via a simple "Admin Config" screen for **Core Team** users only (Ref: PRD 2.2 Permissions).  
* **UI/UX:** \* Strict adherence to **\[PRD Section 4.1\]** (Material 3, Neon Cyan/Sky Blue palette).  
  * No custom "Glassmorphism" shaders; standard Material Surfaces.

## **3\. Technical Foundation References**

* **Architecture:** Offline-First (Room \+ Firestore) per **\[PRD Section 4.2\]**.  
* **Tech Stack:** Kotlin \+ Jetpack Compose \+ Firebase per **\[PRD Section 5\]**.  
* **Constraints:** Zero-billing (Free Tier) per **\[PRD Section 4.3\]**.