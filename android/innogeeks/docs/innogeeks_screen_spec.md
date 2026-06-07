# **UI Design Specification \& Wireframes**

Project: Innogeeks Club Management System 2.0  
Version: 2.0 (Role-Specific Navigation Update)  
Date: 2026-01-15  
Theme: Cyber-Glass Premium  
Target Resolution: Android Large (360x800dp)

## **1\. Design System Foundation**

### **1.1 Color Palette (Hex Codes)**

* **Background\_Main:** \#121212 (Deep Charcoal \- NOT pure black)  
* **Primary\_Neon:** \#5fd5fe (Glowing Cyan)  
* **Secondary\_Sky:** \#2fb5e9 (Muted Blue)  
* **Accent\_Deep:** \#035c85 (Stroke/Borders)  
* **Surface\_Glass:** \#FFFFFF at 5-10% Opacity  
* **Text\_High\_Emphasis:** \#FFFFFF (100%)  
* **Text\_Medium\_Emphasis:** \#B0B0B0 (70%)

### **1.2 Glassmorphism Recipe (The "Premium" Look)**

Apply this style to all **Cards** and **Bottom Sheets**.

* **Fill:** Linear Gradient (Top-Left \#2fb5e9 10% \-\> Bottom-Right \#121212 40%)  
* **Background Blur:** Layer Blur \= 24  
* **Stroke (Border):** Inside, 1px  
  * *Gradient Stroke:* Top-Left \#5fd5fe (50%) \-\> Bottom-Right \#000000 (0%)  
* **Shadow:** Drop Shadow (Y: 10, Blur: 20, Color: \#000000 50%)

### **1.3 Typography (IBM Plex)**

* **H1\_Hero:** 32sp, Bold, Neon Glow Effect  
* **H2\_Section:** 24sp, SemiBold  
* **H3\_CardTitle:** 18sp, Medium  
* **Body\_Regular:** 14sp, Regular  
* **Label\_Mono:** 12sp, Medium (IBM Plex Mono \- for Tech Tags)

## **2\. Role-Specific Navigation (NEW)**

### **2.1 Member Bottom Navigation**

```
┌─────────────────────────────────────────────────────┐
│  🏠 Home  │  📚 Resources  │  📅 Events  │  👤 Profile  │
└─────────────────────────────────────────────────────┘
```
* **4 items** - Standard user experience
* **Style:** Floating pill, glassmorphic background

### **2.2 Coordinator Bottom Navigation**

```
┌─────────────────────────────────────────────────────────────────┐
│  🏠 Home  │  ✅ Attendance  │  📚 Resources  │  📅 Events  │  👤 Profile  │
└─────────────────────────────────────────────────────────────────┘
```
* **5 items** - Maximum Material 3 allows
* **Attendance** is highlighted/primary for this role
* **FAB visible** on Resources and Events screens for upload/create

### **2.3 Core Team Bottom Navigation**

```
┌──────────────────────────────────────────────────────────┐
│  🏠 Home  │  📊 Analytics  │  👥 Members  │  👤 Profile  │
└──────────────────────────────────────────────────────────┘
```
* **4 items** - Clean admin focus
* **TopBar addendum:** 🔔 Bell icon for Notifications
* Resources/Events accessible via Analytics drill-down

### **2.4 Guest Bottom Navigation**

```
┌─────────────────────────┐
│  🏠 Home  │  👤 Profile  │
└─────────────────────────┘
```
* **2 items** - Minimal access
* Other tabs show "Login Required" prompt

## **3\. Screen Specifications**

### **FLOW 1: AUTHENTICATION**

#### **Frame: Auth / 01\_Splash**

* **Layout:** Centered  
* **Background:** Background\_Main \+ Large radial gradient glow (\#035c85 30% opacity) in center.  
* **Content:**  
  * Logo\_Animatable (Center): 120x120dp.  
  * Text\_Brand: "INNOGEEKS" (H2, Tracking: 4px).

#### **Frame: Auth / 02\_Login**

* **Layout:** Column (Gap: 24dp, Padding: 32dp).  
* **Content:**  
  * **Header:**  
    * Text\_Welcome: "Welcome back," (Body, Grey)  
    * Text\_Title: "Agent." (H1, White).  
  * **Glass\_Card\_Form** (Center):  
    * Button\_Google\_SignIn:  
      * *Style:* White Pill Shape.  
      * *Icon:* Google G Logo.  
      * *Text:* "Authenticate via University ID".  
    * Text\_Disclaimer: "By logging in, you agree to Club Protocols." (Caption, Grey).

#### **Frame: Auth / 03\_Identity\_Recovery (Modal)**

* **Type:** Bottom Sheet / Overlay.  
* **Layout:** Column (Gap: 16dp).  
* **Content:**  
  * Handle\_Bar: 32px width, Grey.  
  * Text\_Title: "Identity Verification" (H2).  
  * Text\_Body: "System could not recognize your biometrics (Email). Enter Registration ID manually."  
  * Input\_Field\_Neon:  
    * *State:* Active / Focus.  
    * *Border:* \#5fd5fe Glow.  
  * Button: "Verify" (Primary)
  * Button: "Continue to Login" (if match found, shows masked email hint)
  * Button: "Continue as Guest" (Secondary)

### **FLOW 2: MEMBER DASHBOARD**

#### **Frame: Member / 01\_Home\_Dashboard**

* **Layout:** Vertical Scroll (Padding: 16dp).  
* **Top Bar (Fixed):**  
  * Left: Avatar\_Small (32dp, Circular, Border: Neon).  
  * Right: Icon\_Bell\_Notification (with badge count).  
* **Section 1: The HUD (Heads Up Display)**  
  * **Component:** Widget\_Attendance\_Ring  
    * *Size:* 200x200dp.  
    * *Center:* Text\_Percentage: "85%" (H1).  
    * *Ring:* Animated gradient \#5fd5fe to Transparent.  
    * *Label:* "Android Domain" (Mono).  
* **Section 2: Next Mission**  
  * **Component:** Card\_Event\_Next  
    * *Style:* Glassmorphism.  
    * *Row 1:* "NEXT SESSION" (Mono, Cyan).  
    * *Row 2:* "Intro to Jetpack Compose" (H3).  
    * *Row 3:* Icon\_Clock "2h 15m" | Icon\_Pin "Room 304".  
* **Section 3: Quick Actions** (Grid 2x2)  
  * Button\_Square\_Glass: Icon "History".  
  * Button\_Square\_Glass: Icon "Stats".

### **FLOW 3: COORDINATOR DASHBOARD**

#### **Frame: Coord / 01\_Dashboard**

* **Layout:** Vertical Scroll.  
* **Top Bar:** Same as Member, with 🔔 notification bell.
* **Section 1: Primary Action**  
  * **Button\_Log\_Attendance:** Full width, Primary color
    * Text: "Log Class & Attendance"
    * Icon: Checkmark
* **Section 2: Domain Stats**  
  * Row of StatCards:
    * "24" Students | "12" Classes
* **Section 3: Last Topic**
  * Label: "Last Topic Taught"
  * Text: "Jetpack Compose Navigation"
* **Section 4: Next Event**
  * Card\_Event\_Next (same as Member)

#### **Frame: Coord / 02\_Take\_Attendance**

* **Layout:** Full screen with Scaffold.
* **Top Bar:** Back button, Title "Take Attendance"
* **Section 1: Event Selector**
  * Dropdown: Select Event (pre-populated with today's event)
  * Shows: Event title, date, room
* **Section 2: Student List**
  * Label: "Students (Most Present First)"
  * List of StudentAttendanceRow:
    * Avatar, Name, RegID
    * Attendance % badge
    * Toggle: Present/Absent (animated checkbox)
* **FAB:** Save Attendance (checkmark icon)

### **FLOW 4: CORE TEAM DASHBOARD (NEW)**

#### **Frame: Core / 01\_Dashboard**

* **Layout:** Vertical Scroll.  
* **Top Bar:** 
  * Left: Avatar
  * Center: "Core Team" badge
  * Right: 🔔 Bell (with unread count badge)
* **Section 1: Overview Cards** (Horizontal scroll)
  * Card: "87" Total Members
  * Card: "82%" Avg Attendance
  * Card: "12" Sessions This Week
* **Section 2: Pending Actions**
  * Card\_Alert: "2 Removal Requests Pending" (if any)
  * Tap → Navigate to Members with filter
* **Section 3: Quick Actions** (2x2 Grid)
  * "Analytics" → Analytics Screen
  * "Broadcast" → Create Broadcast Screen
  * "Members" → Members Screen
  * "Reports" → Coming Soon

#### **Frame: Core / 02\_Analytics**

* **Layout:** Tab Layout (Overview, Attendance, Coordinators, Resources)
* **Tab: Overview**
  * Pie Chart: Members by Domain
  * Bar Chart: Attendance by Domain
  * Trend Line: Last 30 days
* **Tab: Attendance**
  * Filter Row: [Domain Dropdown] [Year: 1st/2nd]
  * Line Chart: Attendance trend
  * List: Students with attendance %
    * Tap → Detailed history
* **Tab: Coordinators**
  * List: CoordinatorCard
    * Name, Domain
    * "Sessions: 12" | "Resources: 8"
    * Last active date
  * Tap → Activity Log
* **Tab: Resources**
  * All resources with uploader badge
  * Filter by domain/coordinator

#### **Frame: Core / 03\_Members**

* **Layout:** Scaffold with SearchBar
* **Top Bar:** Search bar (always visible)
* **Filter Chips:** [All Roles] [Domain] [Year]
* **List:** MemberCard
  * Avatar, Name
  * Role badge (colored: Coordinator=Gold, Member=Silver, Core=Platinum)
  * Domain, Year
  * Attendance %
* **Tap → Member Detail**

#### **Frame: Core / 04\_Member\_Detail**

* **Layout:** Vertical Scroll
* **Header:**
  * Large Avatar (100dp)
  * Name, Email
  * Role Badge, Domain, Year
* **Section: Stats**
  * Attendance % ring
  * Sessions Attended / Total
* **Section: History**
  * Last 10 attendance records
* **Actions (if not Core Team member):**
  * Button: "Edit Role" → Role picker modal
  * Button: "Request Removal" (Red, outlined)
    * Triggers voting request creation

### **FLOW 5: RESOURCES**

#### **Frame: Resources / 01\_List\_View**

* **Top Bar:** Search Bar (Glass style)
* **Filter Row:** Chips (All, Android, Web, ML, IoT, Blockchain)
* **Content:** Vertical List of ResourceCard
  * Type Icon (🎥 📄 📝 💻)
  * Title, Description preview
  * Domain Tag
  * Uploader name (small text)
  * Arrow icon for tap
* **FAB (Coordinator/Core only):** "+" Add Resource
* **Guest View:** Shows GuestRestriction overlay

#### **Frame: Resources / 02\_Add\_Resource (Coordinator)**

* **Layout:** Form
* **Fields:**
  * Title (required)
  * URL (required, validated)
  * Type: Dropdown (Video, PDF, Article, GitHub, Other)
  * Description (optional)
* **Button:** "Upload Resource"

### **FLOW 6: EVENTS**

#### **Frame: Events / 01\_List\_View**

* **Top Bar:** Title "Upcoming Events"
* **Filter Row:** Domain chips
* **Content:** Vertical List of ScheduledEventCard
  * Title, Domain tag
  * Date, Time, Room icons
  * Description preview
* **FAB (Coordinator/Core only):** "+" Create Event
* **Guest View:** Shows GuestRestriction overlay

### **FLOW 7: NOTIFICATIONS (NEW)**

#### **Frame: Notifications / 01\_Inbox**

* **Layout:** Vertical List
* **Sections:**
  * **Unread:** Highlighted background
  * **Earlier:** Normal background
* **NotificationCard:**
  * Title (bold if unread)
  * Body preview (2 lines)
  * Timestamp
  * Sender badge (if broadcast)
* **Actions:**
  * Swipe left: Delete
  * Tap: Mark as read + expand
* **Empty State:** "No notifications" with bell icon

#### **Frame: Notifications / 02\_Create\_Broadcast (Core/Coord)**

* **Layout:** Form
* **Fields:**
  * Title (required)
  * Message Body (required, multiline)
  * Target: Radio group
    * All Members
    * Specific Domain (dropdown appears)
    * Specific Year (1st/2nd checkboxes)
  * Priority: Toggle (Normal/Urgent)
* **Preview Card:** Shows how notification will appear
* **Button:** "Send Broadcast"

### **FLOW 8: PROFILE**

#### **Frame: Profile / 01\_Main**

* **Header:**  
  * Image\_Profile\_Large (100dp), animated border.  
  * Text\_Name.  
  * Badge\_Role: Role-specific color (Core=Cyan, Coord=Gold, Member=Silver).  
* **Info Card:**
  * Domain, Year, RegID rows
* **Stats Row:**  
  * Events Attended | Resources Contributed (if applicable).  
* **Settings List:**  
  * "Notification Preferences"  
  * "Logout" (with confirmation)
  * "Delete Account" (Red, hidden for 1st years)

## **4\. Component Library**

### **4.1 Bottom Navigation Variants**

* **Nav\_Member:** 4 items, standard icons
* **Nav\_Coordinator:** 5 items, Attendance highlighted
* **Nav\_CoreTeam:** 4 items, admin icons
* **Nav\_Guest:** 2 items, minimal

### **4.2 Cards**

* **Card\_Stat:** Value (large), Label (small)
* **Card\_Event:** Title, meta row with icons
* **Card\_Resource:** Type icon, title, domain tag
* **Card\_Member:** Avatar, name, role badge, stats
* **Card\_Notification:** Title, preview, timestamp

### **4.3 Buttons**

* **Btn\_Primary\_Neon:** Cyan fill, black text
* **Btn\_Glass\_Secondary:** Transparent, cyan border
* **Btn\_Danger:** Red outline for destructive actions

### **4.4 Overlays**

* **GuestRestriction:** Lock icon, "Login Required" message
* **LoadingShimmer:** Animated placeholder for loading states