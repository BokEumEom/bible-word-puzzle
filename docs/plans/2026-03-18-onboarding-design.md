# Phase 2: Onboarding Flow Design

## Goal
Duolingo-level personalized onboarding that collects user preferences and delivers a "first win" before reaching the Dashboard.

## Flow Diagram

```
App Mount
    |
    v
onboardingCompleted?
    |
   NO --> Onboarding (4-5 steps) --> Save profile --> Dashboard
    |
   YES --> Dashboard (existing)
```

## Steps

```
+--------------+   +--------------+   +--------------+   +--------------+   +--------------+
| 1. Level     | > | 2. MiniPuzzle| > | 3. Interests | > | 4. DailyGoal | > | 5. Result    |
|              |   |              |   | (branched)   |   |              |   |              |
| Experience   |   | 3-4 word     |   | Beginner:    |   | Turtle: 1    |   | "Analyzing.."|
| based cards  |   | puzzle       |   |   SKIP       |   | Rabbit: 3    |   | Stagger cards|
| DiffSelector |   | First win!   |   | Easy:        |   | Eagle:  5    |   | Profile CTA  |
| tone         |   | Celebration  |   |   Presets     |   |              |   |              |
|              |   |              |   | Normal:      |   |              |   |              |
|              |   |              |   |   Presets +   |   |              |   |              |
|              |   |              |   |   Grid toggle |   |              |   |              |
+--------------+   +--------------+   +--------------+   +--------------+   +--------------+
     (1/5)              (2/5)          (3/5 or skip)         (4/5)              (5/5)
```

## Step Details

### Step 1: Level Selection (LevelStep)
- Question: "성경 말씀을 얼마나 접해봤나요?"
- DifficultySelector-style cards (rounded-[2rem], border-b-8, colored bg):
  - Seedling "이제 막 시작해요" -> beginner (bg-emerald-100, border-emerald-300)
  - Herb "주일학교에서 배웠어요" -> easy (bg-amber-100, border-amber-300)
  - Tree "매일 말씀을 읽어요" -> normal (bg-sky-100, border-sky-300)
- Auto-advance on tap

### Step 2: Mini Puzzle (MiniPuzzleStep)
- Purpose: "First win" before any more questions
- Use a hardcoded short verse (3-4 words), e.g. "하나님이 세상을 사랑하사" (simplified)
- Reuse VersePuzzleBoard component (or simplified version)
- On success: celebration animation + "이렇게 쉬워요! 말씀을 맞추며 배워봐요"
- Auto-advance after celebration (2s delay)

### Step 3: Interest Selection (InterestStep) — Branched by Level
- Question: "어떤 말씀에 관심 있나요?"

**beginner -> Auto-skip** with default interests: ['psa', 'pro', 'gen']
- Show brief message: "시편, 잠언, 창세기로 시작할게요!"
- Auto-advance after 1.5s

**easy -> Preset cards only** (multi-select):
- "시편/잠언 — 위로와 지혜" -> ['psa', 'pro']
- "복음서 — 예수님의 이야기" -> ['mat', 'mrk', 'luk', 'jhn']
- "창세기부터 — 처음부터 차근차근" -> ['gen', 'exo']
- "바울서신 — 믿음의 편지" -> ['rom', '1co', 'eph']
- "다음" button (enabled when >= 1 selected)

**normal -> Presets + "직접 고를래요" toggle**:
- Same presets as easy
- Toggle expands BibleSelector abbreviation grid (OT/NT tabs)
- "다음" button

### Step 4: Daily Goal (GoalStep)
- Question: "하루에 몇 구절 배울까요?"
- 3 option cards (DifficultySelector style):
  - Turtle "1구절 — 가볍게" -> dailyGoal: 1
  - Rabbit "3구절 — 꾸준히" -> dailyGoal: 3 (highlighted as recommended)
  - Eagle "5구절 — 도전!" -> dailyGoal: 5
- Auto-advance on tap

### Step 5: Personalized Result (ResultStep)
- Fake loading bar "맞춤 플랜 생성 중..." (2.5s, Framer Motion)
- After loading, result cards stagger in (0.3s each):
  - Level card: "당신의 수준: Herb 주일학교 수준"
  - Interest card: "관심 성경: 시편, 잠언, 복음서"
  - Goal card: "일일 목표: 하루 3구절"
- CTA: "내 맞춤 말씀 시작하기!" (btn-primary)
- Tap -> save profile -> transition to Dashboard

## Data Model

```typescript
// Added to UserProgress
interface OnboardingProfile {
  level: Difficulty;            // 'beginner' | 'easy' | 'normal'
  interests: string[];          // bookId[] from presets/grid
  onboardingCompleted: boolean;
}

// UserProgress becomes:
interface UserProgress {
  // ... existing fields ...
  onboardingProfile: OnboardingProfile;
}

const defaultOnboardingProfile: OnboardingProfile = {
  level: 'beginner',
  interests: [],
  onboardingCompleted: false,
};
```

## Personalization Effects

| Data | Where Used | How |
|------|-----------|-----|
| level | DifficultySelector | Pre-select user's level |
| level | Preset puzzle | Filter verses by difficulty |
| interests | BibleSelector | Show interest books at top |
| interests | Dashboard "오늘의 말씀" | Pick from interest books |
| dailyGoal | DailyGoalBadge | Already wired |
| onboardingCompleted | App.tsx | Gate to show onboarding or dashboard |

## Re-onboarding

Dashboard gets a settings/profile icon (top-right).
Tap -> shows profile summary with "다시 설정하기" button.
This resets onboardingCompleted to false and re-enters the onboarding flow.

## Component Structure

```
src/components/onboarding/
  OnboardingFlow.tsx     -- Container: manages step state, progress dots
  LevelStep.tsx          -- Step 1
  MiniPuzzleStep.tsx     -- Step 2
  InterestStep.tsx       -- Step 3 (branched)
  GoalStep.tsx           -- Step 4
  ResultStep.tsx         -- Step 5
```

## Files Modified / Created

**Created (7):**
- docs/plans/2026-03-18-onboarding-design.md (this file)
- src/components/onboarding/OnboardingFlow.tsx (~80 lines)
- src/components/onboarding/LevelStep.tsx (~60 lines)
- src/components/onboarding/MiniPuzzleStep.tsx (~50 lines)
- src/components/onboarding/InterestStep.tsx (~120 lines)
- src/components/onboarding/GoalStep.tsx (~60 lines)
- src/components/onboarding/ResultStep.tsx (~90 lines)

**Modified (5):**
- src/types/index.ts -- add OnboardingProfile, update GameState
- src/hooks/useUserProgress.ts -- add onboardingProfile to UserProgress
- src/App.tsx -- onboarding gate + 'onboarding' GameState
- src/components/Dashboard.tsx -- profile reset button
- src/components/BibleSelector.tsx -- interest books shown first
