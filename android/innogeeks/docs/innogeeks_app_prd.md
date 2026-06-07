# **Product Requirements Document (PRD)**

**Project Name:** Innogeeks Club Management System 2.0

**Version:** 3.0 (Role-Specific Navigation Update)

**Status:** Draft

**Date:** 2026-01-15

**Platform:** Native Android (Kotlin \+ Jetpack Compose)

## **1\. Executive Summary**

The Innogeeks Club Management System 2.0 is a premium mobile application designed to modernize club operations. The application facilitates role-based access control (RBAC) and replaces the legacy system with a modern Native Android solution. It features secure identity verification via University Registration IDs, a high-fidelity user interface, and an **offline-first architecture**.

**Key Objectives:**

* **Modernization:** Utilize Jetpack Compose to deliver a high-quality, responsive user interface with **Role-Specific Navigation** and updated typography.  
* **Streamlined Attendance:** Replace complex hardware dependencies (QR) with a robust, data-rich **Manual Attendance \& Topic Tracking** system.  
* **Knowledge Sharing:** Enable **Global Resource Access**, allowing every domain to view resources from all other domains to foster cross-disciplinary learning.  
* **Operational Efficiency:** Centralize operations (Attendance, Broadcasts, Resources) with **role-appropriate dashboards**.  
* **Administrative Control:** Provide Core Team with **Analytics**, **Member Management**, and **Broadcast** capabilities.
* **Cost Efficiency:** Operate strictly within free-tier service limits.

## **2\. User Roles \& Authentication**

### **2.1 "Golden List" Authentication System**

* **Source of Truth:** An Excel dataset uploaded by the Core Team to the Firestore database.  
* **Data Structure:** RegID (Primary Key), Email, FullName, Role, Domain, **Year**.  
* **Login Flow:**  
  1. **Identity Provider:** User authenticates via Google Sign-In.  
  2. **Verification Logic:**  
     * **Match:** If email matches Firestore, user is logged in.  
     * **No Match:** User prompted to enter University Registration ID.  
  3. **Account Recovery:** System provides masked email hint upon valid Reg ID entry.  
  4. **Guest Access:** Users not found are assigned 'Guest'.

### **2.2 Roles \& Permissions (Updated)**

| Role | Access Level | Navigation | Permissions |
| :---- | :---- | :---- | :---- |
| **Core Team** | Super Admin | Home, Analytics, Members, Profile | Full system access. **View/Edit all members** (with voting for removal). View ALL domain attendance. Send global broadcasts. View coordinator activity & analytics. |
| **Coordinator** | Admin | Home, Attendance, Resources, Events, Profile | Manage attendance (Manual Entry) for their domain. Upload resources. Create/manage events. Record topics taught. |
| **Member** | User | Home, Resources, Events, Profile | View resources from ALL domains. View personal attendance stats. RSVP to events. |
| **Alumni** | User | *On Hold* | Specialized access to network, view resources, and event archives. |
| **Guest** | Public | Home, Profile (limited) | View general club information only. **Resources and Events restricted.** |

### **2.3 Domain Logic**

* **Domains:** Android, Web, Machine Learning (ML), IoT, Blockchain.  
* **Global Resource Access:** Domain isolation is **removed for resources**. All authenticated users can view resources from any domain.  
* **Attendance Isolation:** Attendance tracking remains domain-specific, managed by the respective Coordinators, but viewable by the Core Team.

## **3\. Functional Requirements**

### **3.1 Role-Specific Navigation (NEW)**

Each role has a distinct bottom navigation experience:

#### **3.1.1 Member Navigation**
```
🏠 Home | 📚 Resources | 📅 Events | 👤 Profile
```
* **Focus:** Personal attendance stats, resource discovery, event participation

#### **3.1.2 Coordinator Navigation**
```
🏠 Home | ✅ Attendance | 📚 Resources | 📅 Events | 👤 Profile
```
* **Focus:** Domain management, attendance tracking, content creation
* **5 tabs** (Material 3 limit)
* **Attendance is PRIMARY action** for this role

#### **3.1.3 Core Team Navigation**
```
🏠 Home | 📊 Analytics | 👥 Members | 👤 Profile
```
* **Focus:** Administrative oversight, analytics, member management
* **4 tabs** (cleaner admin interface)
* **🔔 Bell icon in TopBar** → Notifications inbox
* Resources/Events accessible via Analytics drill-down

#### **3.1.4 Guest Navigation**
```
🏠 Home | 👤 Profile
```
* **Restricted:** Resources and Events show "Login Required" prompt

### **3.2 Dashboard (Home Screen)**

A role-specific dashboard providing immediate access to key metrics and actions.

* **Member/Student View:**  
  * **Attendance Metric:** Visual ring indicator of attendance percentage.  
  * **Next Event:** Display of upcoming session (Room, Topic).  
  * **Quick Actions:** History, Stats buttons.

* **Coordinator View:**  
  * **Class Management:** Prominent "Log Attendance" button.  
  * **Domain Stats:** Students count, sessions conducted.
  * **Last Topic:** Most recent class topic taught.
  * **Next Event:** Upcoming session for their domain.

* **Core Team View:**  
  * **Overview Cards:** Total members, average attendance, active sessions.
  * **Pending Actions:** Removal requests, flagged items.
  * **Quick Links:** Analytics, Broadcast buttons.

### **3.3 Attendance System**

* **Mechanism:** **Manual Attendance Tracking** by Coordinator.  
* **Flow:**  
  1. Coordinator taps "Take Attendance" from Dashboard or Attendance tab.
  2. Selects Event (pre-populated with today's scheduled event).
  3. **Topic from Event:** Topic is linked to the Event, not entered separately.
  4. **Student List:** Displays students in the domain, **sorted by "Most Present"** at top.
  5. Coordinator toggles Present/Absent for each student.
  6. Saves attendance record linked to Event.

* **Core Team Visibility:** Analytics module shows attendance stats for **1st and 2nd Year** students across all domains.

### **3.4 Analytics Module (Core Team Only) (NEW)**

Comprehensive oversight dashboard for Core Team members.

* **Overview Tab:**
  * Total Members (with domain breakdown)
  * Average Attendance % across all domains
  * Sessions This Week
  * Trend indicators (up/down arrows)

* **Attendance Tab:**
  * Filter by Domain and Year (1st/2nd)
  * Attendance trend chart (line graph)
  * Per-student attendance list with drill-down

* **Coordinators Tab:**
  * List of all Coordinators with:
    * Sessions conducted count
    * Resources uploaded count
    * Last active date
  * Drill-down to full activity log

* **Resources Oversight Tab:**
  * All resources with uploader info
  * Filter by domain/coordinator

### **3.5 Members Module (Core Team Only) (NEW)**

Member management with controlled editing capabilities.

* **Members List:**
  * Search and filter (Role, Domain, Year)
  * Member cards with avatar, name, role badge, attendance %
  
* **Member Detail:**
  * Full profile information
  * Attendance history
  * Edit Role button (disabled for other Core Team members)
  * Request Removal button

* **Removal Voting System:**
  * Core Team member initiates "Request Removal"
  * System creates RemovalRequest record
  * All other Core Team members notified
  * **Unanimous approval required** from all Core Team members
  * Action executes only after ALL Core Team members approve

### **3.6 Resource Library**

* **Access Control:** **Members, Coordinators, Core Team** can view. **Guests restricted.**
* **User Interface:** Card-based layout with Title, Domain Tag, Type Icon, Uploader.  
* **Interaction:** External links open via Chrome Custom Tabs.  
* **Content Management:** 
  * Coordinators can **upload** resources (FAB button visible)
  * Core Team has oversight view in Analytics

### **3.7 Events Module**

* **Access Control:** **Members, Coordinators, Core Team** can view. **Guests restricted.**
* **Member View:** View events, RSVP functionality
* **Coordinator View:** View + Create/Manage events for their domain (FAB visible)
* **Core Team View:** Accessible via Analytics for oversight

### **3.8 Notifications Module (NEW)**

* **Notification Inbox (All Users):**
  * Accessible via 🔔 bell icon in TopBar
  * Unread/Read sections
  * Mark as read, clear functionality
  * Badge count for unread

* **Broadcast Creation (Core Team + Coordinators):**
  * Title and Message body
  * Target Audience: All, Domain-specific, Year-specific
  * Priority: Normal, Urgent
  * Schedule: Immediate or scheduled
  * FCM integration for push delivery

### **3.9 User Profile \& Settings**

* **Profile Display:** Avatar, Name, Role badge, Domain, Year
* **Stats Row:** Events attended, Resources contributed
* **Settings:**
  * Notification Preferences
  * Logout
  * **Delete Account** (HIDDEN for 1st-Year Students)

## **4\. Non-Functional Requirements**

### **4.1 UI/UX Guidelines**

* **Design System:** **Material 3 Implementation** (Standard Guidelines).  
* **Visual Theme:** Light/Dark Mode support based on system settings.  
* **Typography:**  
  * **Display Font:** IBM Plex Sans (Headlines, Titles).  
  * **Body Font:** IBM Plex Mono (Body text, Labels, Code snippets).  
* **Color Palette:**  
  * **Primary:** \#5FD5FE (Neon Cyan)  
  * **Secondary:** \#2FB5E9 (Sky Blue)  
  * **Tertiary:** \#035C85 (Deep Blue)  
  * **Error:** \#FF3B30 (Red)  
  * **Neutral:** \#121212 (Deep Charcoal)  
* **Navigation Style:** **Role-Specific Floating Bottom Navigation Bar**.

### **4.2 Security \& Performance**

* **Database Security:** Firestore Security Rules with role-based access.
* **Guest Restriction:** Resources and Events require authentication.
* **Performance:** Offline-first architecture using Room Database.

### **4.3 Cost Constraints**

* **Zero Billing Mandate:** Operate strictly within free tiers (Firebase/Cloudinary).

## **5\. Technical Stack**

* **Core:** Kotlin, Jetpack Compose (Material 3).  
* **Architecture:** MVVM \+ Clean Architecture, Feature-First packaging.  
* **Backend:** Firebase (Auth, Firestore, FCM, Storage).
* **Charts:** **Vico** - Lightweight, extensible charting library for Compose (beautiful UI, animations, highly customizable).
* **Dependency Injection:** Hilt.