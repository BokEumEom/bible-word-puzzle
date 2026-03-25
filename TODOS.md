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

## P2: Empty State 컴포넌트 구현

**What:** 5개 화면(최근 말씀, 좋아하는 말씀, 업적, 복습 알림, 컬렉션 진행)에 빈 상태 디자인 추가.

**Why:** 새 사용자는 데이터 없는 상태로 시작. 현재 데이터 없으면 섹션이 사라지거나 빈 화면 표시 — 기능이 있는지조차 모름. 듀오링고는 빈 상태를 따뜻한 안내 + CTA로 처리.

**Pros:** 첫 사용자 경험 대폭 개선, 기능 발견성 향상.
**Cons:** 5개 빈 상태 컴포넌트 추가.

**Context:** DESIGN.md "Empty States" 섹션에 각 화면별 이모지/메시지/CTA 스펙 정의됨. 공통 EmptyState 컴포넌트를 만들고 각 화면에서 사용.

**Depends on:** DESIGN.md (완료). 독립 작업 가능.

## P3: aria-label 전체 추가

**What:** 모든 인터랙티브 요소(버튼, 카드, 링크)에 의미있는 aria-label 추가.

**Why:** 현재 프로필 버튼만 aria-label 있음. 뒤로가기 버튼, 카드 버튼, 3D 버튼 등에 없음.

**Pros:** 접근성 기본 충족, 스크린 리더 지원.
**Cons:** 많은 파일에 소규모 변경.

**Context:** 모바일 PWA이므로 키보드 네비게이션보다 스크린 리더 지원이 우선.

**Depends on:** Nothing. 독립 작업 가능.
