# KaalPatra - Application Flow & Architecture

## 🔄 Complete User Journey (Flow Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER OPENS APP                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │  Load Messages from localStorage      │
         │  (getMessages function)               │
         └────────────┬────────────────────────┘
                      │
                      ▼
         ┌───────────────────────────────────────┐
         │  Display MessageList Component        │
         │  - Shows all saved messages           │
         │  - Updates every 30 seconds           │
         │  - Checks lock status for each        │
         └────────────┬────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   ┌──────────────┐          ┌──────────────┐
   │ User Writes  │          │ Message Card │
   │ New Message  │          │ (Locked or   │
   │              │          │  Unlocked)   │
   └──────┬───────┘          └──────┬───────┘
          │                         │
          ▼                         ▼
   ┌──────────────────┐    ┌──────────────────┐
   │ MessageForm      │    │ Shows 🔒 or 🔓   │
   │ Component:       │    │ Status Badge     │
   │ - Text area      │    │                  │
   │ - Date picker    │    │ If locked:       │
   │ - Submit btn     │    │ - Hide content   │
   └────────┬─────────┘    │ - Show countdown │
            │              │ - Show unlock    │
            ▼              │   time           │
   ┌──────────────────┐    │                  │
   │ VALIDATION STEP  │    │ If unlocked:     │
   │ ✓ Not empty?     │    │ - Show message   │
   │ ✓ Future date?   │    │ - Show delete btn│
   └────────┬─────────┘    └──────┬───────────┘
            │                     │
      ┌─────┴─────┐              │
      │            │              │
  ERROR?      SUCCESS?           │
      │            │              │
      ▼            ▼              ▼
  Show Error  ┌──────────────┐  User Actions
   Message    │ Save Message │
             │ (localStorage)│
             │ saveMessage() │
             └───────┬──────┘
                     │
                     ▼
          ┌────────────────────┐
          │ localStorage       │
          │ kaalpatra_messages │
          │ [all messages]     │
          └────────────────────┘
                     │
                     ▼
          ┌────────────────────┐
          │ User Can:          │
          │ • Read locked msgs │
          │ • Read unlocked    │
          │ • Delete messages  │
          │ • Write new ones   │
          └────────────────────┘
```

## 🏗️ System Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                     USER BROWSER                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────── REACT APP ────────────────────┐   │
│  │                                                   │   │
│  │  ┌────────────── App.jsx ──────────────┐         │   │
│  │  │ (Main component, state manager)    │         │   │
│  │  │                                    │         │   │
│  │  │  refreshTrigger (state)            │         │   │
│  │  │                                    │         │   │
│  │  └────────────────────────────────────┘         │   │
│  │           │                │                    │   │
│  │           ▼                ▼                    │   │
│  │  ┌──────────────────┐  ┌──────────────────┐   │   │
│  │  │ MessageForm      │  │ MessageList      │   │   │
│  │  │                  │  │                  │   │   │
│  │  │ ┌──────────────┐ │  │ ┌──────────────┐ │   │   │
│  │  │ │ Text Input   │ │  │ │ Maps through │ │   │   │
│  │  │ │ Date Picker  │ │  │ │ all messages │ │   │   │
│  │  │ │ Validate     │ │  │ │              │ │   │   │
│  │  │ │ Submit Btn   │ │  │ │ Renders:     │ │   │   │
│  │  │ └──────────────┘ │  │ │ ┌──────────┐ │ │   │   │
│  │  │                  │  │ │ │MessageCrd│ │ │   │   │
│  │  │ Calls:           │  │ │ │MessageCrd│ │ │   │   │
│  │  │ saveMessage()    │  │ │ │MessageCrd│ │ │   │   │
│  │  │                  │  │ │ └──────────┘ │ │   │   │
│  │  └──────────────────┘  │ │              │ │   │   │
│  │                        │ │ Auto-refresh:│ │   │   │
│  │                        │ │ 30s interval │ │   │   │
│  │                        │ └──────────────┘ │   │   │
│  │                             │             │   │   │
│  │                             ▼             │   │   │
│  │                      ┌──────────────┐    │   │   │
│  │                      │ MessageCard  │    │   │   │
│  │                      │              │    │   │   │
│  │                      │ ┌──────────┐ │    │   │   │
│  │                      │ │ Status   │ │    │   │   │
│  │                      │ │ 🔒 or 🔓 │ │    │   │   │
│  │                      │ │          │ │    │   │   │
│  │                      │ │ Content  │ │    │   │   │
│  │                      │ │ (if unlk)│ │    │   │   │
│  │                      │ │          │ │    │   │   │
│  │                      │ │ Delete   │ │    │   │   │
│  │                      │ │ button   │ │    │   │   │
│  │                      │ └──────────┘ │    │   │   │
│  │                      └──────────────┘    │   │   │
│  │                                         │   │   │
│  └─────────────────────────────────────────┘   │   │
│                                                 │   │
│  ┌──────────── UTILITY LAYER ─────────────┐   │   │
│  │                                         │   │   │
│  │  timeUtils.js                          │   │   │
│  │  ├─ isUnlocked()                       │   │   │
│  │  ├─ formatDateTime()                   │   │   │
│  │  └─ getTimeRemaining()                 │   │   │
│  │                                         │   │   │
│  │  storageUtils.js                       │   │   │
│  │  ├─ getMessages()                      │   │   │
│  │  ├─ saveMessage()                      │   │   │
│  │  └─ deleteMessage()                    │   │   │
│  │                                         │   │   │
│  └─────────────────────────────────────────┘   │   │
│                                                 │   │
│  ┌──────────── STYLING ──────────────────┐     │   │
│  │                                        │     │   │
│  │ index.css (Global dark theme)         │     │   │
│  │ App.css (Header, footer)              │     │   │
│  │ MessageForm.css (Form styling)        │     │   │
│  │ MessageCard.css (Card styling)        │     │   │
│  │ MessageList.css (Grid layout)         │     │   │
│  │                                        │     │   │
│  └────────────────────────────────────────┘     │   │
│                                                  │   │
└──────────────────────────────────────────────────┘   │
│                                                      │
│  ┌──── BROWSER localStorage ────┐                  │
│  │                              │                  │
│  │ kaalpatra_messages           │                  │
│  │ [                            │                  │
│  │   {id, message, createdAt,   │                  │
│  │    unlockAt},                │                  │
│  │   {id, message, createdAt,   │                  │
│  │    unlockAt},                │                  │
│  │   ...                        │                  │
│  │ ]                            │                  │
│  │                              │                  │
│  └──────────────────────────────┘                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
USER INPUT (Write Message)
       │
       ▼
┌──────────────────────┐
│ MessageForm Component│
│ - Captures text      │
│ - Captures date/time │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Validation Check     │
│ - Empty?             │
│ - Past date?         │
└────────┬─────────────┘
         │
      ┌──┴──┐
      │     │
    FAIL   PASS
      │     │
      ▼     ▼
    Error  ┌──────────────────────┐
           │ Create Message Object│
           │ {id, message,        │
           │  createdAt,unlockAt} │
           └────────┬─────────────┘
                    │
                    ▼
           ┌──────────────────────┐
           │ storageUtils.        │
           │ saveMessage()        │
           └────────┬─────────────┘
                    │
                    ▼
           ┌──────────────────────┐
           │ localStorage         │
           │ (Persistent Storage) │
           └────────┬─────────────┘
                    │
                    ▼
           ┌──────────────────────┐
           │ Refresh UI           │
           │ (Load messages again)│
           └────────┬─────────────┘
                    │
                    ▼
        ┌────────────────────────┐
        │ MessageList renders    │
        │ all messages with      │
        │ lock status            │
        └────────┬───────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
  LOCKED      LOCKED      UNLOCKED
  Message 1   Message 2   Message 3
  (Hidden)    (Hidden)    (Visible)
  🔒          🔒          🔓
```

## 📊 Component Hierarchy

```
App
├── Header (app title & subtitle)
├── MessageForm
│   ├── Text Input
│   ├── Date Picker
│   └── Submit Button
├── MessageList
│   └── MessageCard (x N)
│       ├── Status Icon (🔒 or 🔓)
│       ├── Message Content (if unlocked)
│       ├── Placeholder Text (if locked)
│       ├── Timestamps
│       ├── Countdown (if locked)
│       └── Delete Button
└── Footer
```

## ⚙️ How Time Checking Works

```
Every 30 seconds:
    │
    ▼
┌─────────────────────────┐
│ Get Current Time        │
│ now = Date.now()        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ For Each Message:       │
└────────┬────────────────┘
         │
         ├─ Get unlockAt time
         │
         ├─ Compare:
         │  if (now >= unlockAt)
         │
         ├─ if YES → 🔓 UNLOCKED
         │           Show content
         │
         └─ if NO  → 🔒 LOCKED
                     Hide content
                     Show countdown
```

## 💾 Data Persistence Flow

```
User creates message
         │
         ▼
Message object created:
{
  id: "uuid-1234",
  message: "Hello future me",
  createdAt: "2026-04-07T10:30:00Z",
  unlockAt: "2026-04-07T14:30:00Z"
}
         │
         ▼
saveMessage() function:
- Get existing messages from localStorage
- Add new message to array
- Convert array to JSON string
- Save to localStorage with key "kaalpatra_messages"
         │
         ▼
Persisted in Browser Memory
         │
    ┌────┴────┐
    │          │
    ▼          ▼
Page reload  Browser   
(Data still  closed
saved)       (Data still
             saved)
    │          │
    └────┬─────┘
         │
         ▼
Only lost if:
- User clears browser cache
- User deletes localStorage manually
- Browser doesn't support localStorage
```

---

**Key Takeaway**: The app is simple but demonstrates how real apps work:
1. User interaction (forms)
2. Data validation
3. Time logic
4. Storage management
5. Reactive UI updates (when data changes, UI updates)
