# Onboarding Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a new intro step and redesign onboarding into a Duolingo-style hybrid flow that emphasizes quick product understanding and faster progression.

**Architecture:** Keep the existing onboarding container and step boundaries, but insert a new intro step, reorder the flow to introduce the mini puzzle earlier, and standardize the middle selection steps around one white-card selection pattern. Simplify the result screen so it confirms the personalized setup instead of simulating a long loading sequence.

**Tech Stack:** React, TypeScript, Vitest, React Testing Library, Tailwind CSS, motion/react, lucide-react

---

### Task 1: Lock the new flow in tests

**Files:**
- Modify: `src/components/onboarding/OnboardingFlow.test.tsx`
- Create: `src/components/onboarding/ResultStep.test.tsx`
- Create: `src/components/onboarding/SelectionStep.test.tsx`

**Step 1: Write the failing test**

- Add a failing `OnboardingFlow` test that expects:
  - the first step to be the new intro screen
  - 6 progress dots
  - the flow order to be `intro -> puzzle -> level -> interest -> goal -> result`
- Add a failing `ResultStep` test that expects:
  - no fake loading text on initial render
  - summary cards and CTA to render immediately
- Add a failing selection-step test that expects:
  - white-card list styling
  - consistent icon tile, title, description, and chevron/check affordance

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/onboarding/OnboardingFlow.test.tsx src/components/onboarding/ResultStep.test.tsx src/components/onboarding/SelectionStep.test.tsx`

Expected: FAIL because the intro step does not exist, the step order is unchanged, and the result screen still shows loading.

**Step 3: Write minimal implementation**

- Add the minimal shared selection-step surface and introduce the new intro contract needed to make the tests pass.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/onboarding/OnboardingFlow.test.tsx src/components/onboarding/ResultStep.test.tsx src/components/onboarding/SelectionStep.test.tsx`

Expected: PASS

### Task 2: Add intro step and reorder the flow

**Files:**
- Create: `src/components/onboarding/IntroStep.tsx`
- Modify: `src/components/onboarding/OnboardingFlow.tsx`
- Modify: `src/components/onboarding/OnboardingFlow.test.tsx`

**Step 1: Write the failing test**

- Assert that tapping the intro CTA advances to the puzzle step.
- Assert that completing the puzzle advances to level, then interest, then goal, then result.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/onboarding/OnboardingFlow.test.tsx`

Expected: FAIL because the intro step is missing and the current flow starts at level.

**Step 3: Write minimal implementation**

- Add a new `intro` step type.
- Start the flow at `intro`.
- Change transitions to `intro -> puzzle -> level -> interest -> goal -> result`.
- Update progress dot count to 6.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/onboarding/OnboardingFlow.test.tsx`

Expected: PASS

### Task 3: Standardize the middle selection steps

**Files:**
- Create: `src/components/onboarding/SelectionStep.tsx`
- Modify: `src/components/onboarding/LevelStep.tsx`
- Modify: `src/components/onboarding/InterestStep.tsx`
- Modify: `src/components/onboarding/GoalStep.tsx`
- Create: `src/components/onboarding/SelectionStep.test.tsx`

**Step 1: Write the failing test**

- Assert that the shared selection step renders white cards with a consistent icon tile and selectable state.
- Assert that `LevelStep` and `GoalStep` use the shared presentation.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/onboarding/SelectionStep.test.tsx`

Expected: FAIL because the shared component does not exist.

**Step 3: Write minimal implementation**

- Extract a shared list-card pattern for single-select screens.
- Apply it to `LevelStep` and `GoalStep`.
- Keep `InterestStep` multi-select behavior, but restyle presets, toggle, and grid to match the same card system.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/onboarding/SelectionStep.test.tsx`

Expected: PASS

### Task 4: Simplify the result screen

**Files:**
- Modify: `src/components/onboarding/ResultStep.tsx`
- Modify: `src/components/onboarding/ResultStep.test.tsx`

**Step 1: Write the failing test**

- Assert that the result screen renders immediately with:
  - headline
  - 3 summary cards
  - final CTA

**Step 2: Run test to verify it fails**

Run: `npm test -- src/components/onboarding/ResultStep.test.tsx`

Expected: FAIL because the current screen starts in a loading state.

**Step 3: Write minimal implementation**

- Remove fake loading state and delayed cards.
- Render a concise confirmation screen using the same white-card language.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/components/onboarding/ResultStep.test.tsx`

Expected: PASS

### Task 5: Verify the full redesign

**Files:**
- Modify: `src/components/onboarding/IntroStep.tsx`
- Modify: `src/components/onboarding/OnboardingFlow.tsx`
- Modify: `src/components/onboarding/LevelStep.tsx`
- Modify: `src/components/onboarding/InterestStep.tsx`
- Modify: `src/components/onboarding/GoalStep.tsx`
- Modify: `src/components/onboarding/ResultStep.tsx`
- Modify: `src/components/onboarding/OnboardingFlow.test.tsx`
- Create: `src/components/onboarding/ResultStep.test.tsx`
- Create: `src/components/onboarding/SelectionStep.test.tsx`

**Step 1: Run targeted tests**

Run: `npm test -- src/components/onboarding/OnboardingFlow.test.tsx src/components/onboarding/ResultStep.test.tsx src/components/onboarding/SelectionStep.test.tsx`

Expected: PASS

**Step 2: Run full verification**

Run: `npm run lint`
Run: `npm test`
Run: `npm run build`

Expected: all PASS
