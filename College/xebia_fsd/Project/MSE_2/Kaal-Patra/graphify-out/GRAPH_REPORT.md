# Graph Report - .  (2026-04-29)

## Corpus Check
- Corpus is ~13,965 words - fits in a single context window. You may not need a graph.

## Summary
- 95 nodes · 87 edges · 25 communities detected
- Extraction: 79% EXTRACTED · 21% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Pages|UI Components & Pages]]
- [[_COMMUNITY_Time Utils & Details|Time Utils & Details]]
- [[_COMMUNITY_Groq AI Service|Groq AI Service]]
- [[_COMMUNITY_Leaderboard Service|Leaderboard Service]]
- [[_COMMUNITY_Firestore Service|Firestore Service]]
- [[_COMMUNITY_Database Seeding|Database Seeding]]
- [[_COMMUNITY_Dashboard Stats UI|Dashboard Stats UI]]
- [[_COMMUNITY_Stats Redux Slice|Stats Redux Slice]]
- [[_COMMUNITY_Local Storage Utils|Local Storage Utils]]
- [[_COMMUNITY_History List|History List]]
- [[_COMMUNITY_README Docs|README Docs]]
- [[_COMMUNITY_Message List|Message List]]
- [[_COMMUNITY_Message Form|Message Form]]
- [[_COMMUNITY_AI Coach Card|AI Coach Card]]
- [[_COMMUNITY_Commitment Card|Commitment Card]]
- [[_COMMUNITY_Judgment Modal|Judgment Modal]]
- [[_COMMUNITY_Daily Alert Banner|Daily Alert Banner]]
- [[_COMMUNITY_Footer|Footer]]
- [[_COMMUNITY_History Page|History Page]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Main Entry|Main Entry]]
- [[_COMMUNITY_Redux Store|Redux Store]]
- [[_COMMUNITY_Commitments Slice|Commitments Slice]]
- [[_COMMUNITY_Firebase Config|Firebase Config]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 14 edges
2. `getAICoachMessage()` - 5 edges
3. `MessageCard()` - 4 edges
4. `calculateStats()` - 3 edges
5. `formatDateTime()` - 3 edges
6. `getMessages()` - 3 edges
7. `getCommitmentsRef()` - 3 edges
8. `CommitmentDetailPage()` - 3 edges
9. `ProtectedRoute()` - 2 edges
10. `PublicRoute()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `HistoryList()` --calls--> `useAuth()`  [INFERRED]
  src/components/History/HistoryList.jsx → src/context/AuthContext.jsx
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  src/App.jsx → src/context/AuthContext.jsx
- `PublicRoute()` --calls--> `useAuth()`  [INFERRED]
  src/App.jsx → src/context/AuthContext.jsx
- `App()` --calls--> `useAuth()`  [INFERRED]
  src/App.jsx → src/context/AuthContext.jsx
- `CommitmentList()` --calls--> `useAuth()`  [INFERRED]
  src/components/Commitment/CommitmentList.jsx → src/context/AuthContext.jsx

## Communities

### Community 0 - "UI Components & Pages"
Cohesion: 0.09
Nodes (12): App(), ProtectedRoute(), PublicRoute(), useAuth(), AuthPage(), CommitmentForm(), CommitmentList(), CommitmentsPage() (+4 more)

### Community 1 - "Time Utils & Details"
Cohesion: 0.24
Nodes (6): CommitmentDetailPage(), MessageCard(), formatDateTime(), getConsecutiveDayStreak(), getTimeRemaining(), isUnlocked()

### Community 2 - "Groq AI Service"
Cohesion: 0.6
Nodes (5): buildPrompt(), getAICoachMessage(), getCacheKey(), safeGetCache(), safeSetCache()

### Community 3 - "Leaderboard Service"
Cohesion: 0.4
Nodes (2): deriveDisplayName(), updateLeaderboardEntry()

### Community 4 - "Firestore Service"
Cohesion: 0.47
Nodes (3): addCommitment(), fetchCommitments(), getCommitmentsRef()

### Community 5 - "Database Seeding"
Cohesion: 0.5
Nodes (0): 

### Community 6 - "Dashboard Stats UI"
Cohesion: 0.5
Nodes (0): 

### Community 7 - "Stats Redux Slice"
Cohesion: 0.67
Nodes (2): calculateStats(), selectDerivedStats()

### Community 8 - "Local Storage Utils"
Cohesion: 0.83
Nodes (3): deleteMessage(), getMessages(), saveMessage()

### Community 9 - "History List"
Cohesion: 0.67
Nodes (1): HistoryList()

### Community 10 - "README Docs"
Cohesion: 0.67
Nodes (3): AI Coach, Integrity Score, Kaal-Patra

### Community 11 - "Message List"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Message Form"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "AI Coach Card"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Commitment Card"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Judgment Modal"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Daily Alert Banner"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Footer"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "History Page"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Main Entry"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Redux Store"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Commitments Slice"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Firebase Config"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **2 isolated node(s):** `Integrity Score`, `AI Coach`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Message List`** (2 nodes): `MessageList()`, `MessageList.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Message Form`** (2 nodes): `MessageForm()`, `MessageForm.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AI Coach Card`** (2 nodes): `AICoachCard()`, `AICoachCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Commitment Card`** (2 nodes): `CommitmentCard()`, `CommitmentCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Judgment Modal`** (2 nodes): `JudgmentModal()`, `JudgmentModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Daily Alert Banner`** (2 nodes): `DailyAlertBanner()`, `DailyAlertBanner.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer`** (2 nodes): `Footer()`, `Footer.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `History Page`** (2 nodes): `HistoryPage()`, `HistoryPage.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Main Entry`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Redux Store`** (1 nodes): `store.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Commitments Slice`** (1 nodes): `commitmentsSlice.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Firebase Config`** (1 nodes): `config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `UI Components & Pages` to `History List`, `Time Utils & Details`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **Why does `CommitmentDetailPage()` connect `Time Utils & Details` to `UI Components & Pages`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 13 inferred relationships involving `useAuth()` (e.g. with `ProtectedRoute()` and `PublicRoute()`) actually correct?**
  _`useAuth()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `MessageCard()` (e.g. with `isUnlocked()` and `formatDateTime()`) actually correct?**
  _`MessageCard()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `formatDateTime()` (e.g. with `MessageCard()` and `CommitmentDetailPage()`) actually correct?**
  _`formatDateTime()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Integrity Score`, `AI Coach` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._