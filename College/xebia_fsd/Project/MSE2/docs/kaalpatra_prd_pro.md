# 📄 Product Requirements Document (PRD)

## 🏷️ Product Name  
**KaalPatra (कालपत्र)**  
*A letter across time*

---

# 🧭 1. Vision
Enable individuals to communicate with their future selves through a secure, time-locked messaging system that promotes reflection and intentional thinking.

---

# 🎯 2. Objectives
- Provide a minimal, intuitive interface for writing future messages  
- Ensure strict time-based access control  
- Deliver a smooth and reliable user experience  

---

# 🧩 3. Problem Statement
Current tools:
- Notes apps → no delayed access  
- Reminders → lack emotional depth  

Users need a system that combines **time delay + personal reflection**.

---

# 💡 4. Solution Overview
KaalPatra allows users to:
1. Write a message  
2. Select a future unlock time  
3. Lock the message until that time  

---

# 👥 5. Target Audience
- Students (primary)  
- Journal writers  
- Self-improvement enthusiasts  

---

# ⚙️ 6. Core Features (MVP)

## 6.1 Message Creation
- Text input field  
- Date & time picker  
- Submit (Lock Message)

## 6.2 Storage
- localStorage (JSON-based persistence)

## 6.3 Time Lock Logic
- If current time < unlock time → Locked  
- If current time ≥ unlock time → Unlocked  

## 6.4 Message Dashboard
- List of all messages  
- Status indicator:
  - 🔒 Locked  
  - 🔓 Unlocked  

---

# 🔄 7. User Flows

## Flow A: Create Message
1. User enters message  
2. Selects future time  
3. Clicks lock  
4. Message saved  

## Flow B: View Messages
1. User opens dashboard  
2. System checks timestamps  
3. Displays locked/unlocked state  

---

# 🧱 8. System Architecture

## Frontend
- React (Functional Components)
- Hooks: useState, useEffect

## Storage
- localStorage

## Logic Layer
- Time comparison utility

---

# 📁 9. Folder Structure

```
src/
 ├── components/
 │    ├── MessageForm.jsx
 │    ├── MessageList.jsx
 │    ├── MessageCard.jsx
 │
 ├── utils/
 │    └── timeUtils.js
 │
 ├── App.jsx
 └── index.js
```

---

# 📊 10. Data Model

```json
{
  "id": "uuid",
  "message": "string",
  "createdAt": "timestamp",
  "unlockAt": "timestamp",
  "status": "locked/unlocked"
}
```

---

# 🎨 11. UI/UX Principles
- Minimal and distraction-free  
- Clear lock/unlock indicators  
- Readable typography  
- Card-based layout  

---

# 🚫 12. Out of Scope
- Authentication  
- Backend/database  
- AI features  
- Multi-device sync  

---

# 🚀 13. Future Enhancements
- Password-protected messages  
- Email delivery  
- Cloud sync (Firebase)  
- Reflection prompts  
- Mobile app version  

---

# 📏 14. Success Metrics
- Messages saved without error  
- Correct lock/unlock behavior  
- Fast UI responsiveness  

---

# ⚠️ 15. Risks & Edge Cases
- Incorrect system time on device  
- Data loss (localStorage cleared)  
- Timezone inconsistencies  

---

# 🧠 16. One-Line Pitch
**“KaalPatra enables users to send messages to their future selves by locking them in time.”**

---

# 🎤 17. Viva Explanation (Short)
“KaalPatra is a React-based application that uses localStorage and time-based logic to restrict access to user messages until a predefined timestamp. It focuses on simplicity, reliability, and meaningful delayed interaction.”
