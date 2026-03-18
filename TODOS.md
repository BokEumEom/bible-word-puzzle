# TODOs

## P2: GameState type-safe transitions

**What:** Replace `useState<GameState>` with a `useReducer`-based state machine that enforces valid transitions at compile time.

**Why:** Currently any `setGameState('x')` call is valid — a wrong transition silently puts the app in a broken visual state. As the app grows, this becomes a real bug vector.

**Pros:** Compile-time safety, self-documenting state graph, easier to add new states.
**Cons:** Touches App.tsx significantly, adds ~50 lines of reducer + transition type.

**Context:** App.tsx uses `useState<GameState>` where `GameState` is a union of 9 string literals. There are ~15 transition points across the file. The state graph is:
```
home → difficulty → playing → result → home
home → select-bible → select-mode → reading|memorizing|custom-playing → select-mode
```
A `dispatch({ type: 'SELECT_BOOK', book })` pattern would make invalid transitions impossible.

**Depends on:** Nothing. Can be done independently.

## P3: Split BibleSelector.tsx into smaller components

**What:** Extract theme constants, BookGrid, ChapterGrid, and VerseList into separate files from the 475-line BibleSelector.tsx.

**Why:** The file has 3 distinct views (book/chapter/verse), a 50-line theme object, and a helper component (ChapterNavigator). Each could be independently tested and easier to reason about.

**Pros:** Better readability, independently testable pieces, easier to modify one view without reading all 475 lines.
**Cons:** More files to navigate. Marginal benefit until the file grows further.

**Context:** Currently under the 800-line max but trending up. The `themes` const and `ChapterNavigator` are already semi-independent.

**Depends on:** Nothing. Can be done independently.

## P2: E2E tests with Playwright

**What:** Add Playwright E2E tests covering critical user flows.

**Why:** Unit tests (22 passing) cover logic but can't catch rendering, navigation, or interaction bugs. The drag-and-drop puzzle is entirely untested.

**Pros:** Catches integration bugs, validates real user flows, enables CI confidence for deployments.
**Cons:** Adds Playwright dependency, CI setup, and ~30s test run time.

**Context:** Critical flows to test:
1. Home → select bible → pick book → pick chapter → pick verse → puzzle → correct answer
2. Preset mode: Home → difficulty → playing → result
3. Error states: fetch failure → retry button works
4. TTS: reading screen plays audio, navigating away stops it

**Depends on:** Vitest setup (done). Playwright is an independent addition.
