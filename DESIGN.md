# Design System — 말씀 팡팡

> 듀오링고 디자인 철학을 성경 학습 앱에 적용한 디자인 시스템.
> 모든 UI 결정의 단일 소스 오브 트루스.

## Design Philosophy

**"게임처럼 재밌고, 성경처럼 따뜻하게"**

듀오링고에서 빌린 원칙:
1. **솔리드 > 글래스모피즘** — 불투명 배경, 명확한 경계. backdrop-blur 없음.
2. **box-shadow 3D 버튼** — 모든 CTA는 box-shadow로 입체감. border-b-4 아님.
3. **짧은 성취 루프** — 탭 → 작은 보상 → 다음 단계. 매번 도파민.
4. **따뜻한 타이포** — 둥글고 굵은 글꼴. 차갑지 않게.
5. **컬러는 역할** — 색상은 장식이 아니라 의미를 전달.
6. **빈 상태는 기능** — "데이터 없음"은 디자인이 아님. 따뜻함 + CTA.

## Color Palette

| 역할 | 색상 | Tailwind | 사용처 |
| ---- | ---- | -------- | ------ |
| Primary (CTA) | Orange | `orange-400`~`orange-600` | 메인 버튼, 활성 상태 |
| Success | Emerald | `emerald-500`~`emerald-700` | 정답, 완료, 복습 |
| Warning | Amber | `amber-400`~`amber-600` | 오답, 힌트, 주의 |
| Info/Progress | Violet | `violet-400`~`violet-600` | XP, 레벨, 골 |
| Favorite | Rose | `rose-400`~`rose-500` | 좋아하는 말씀 |
| Streak | Orange | `orange-500` | 연속 학습 불꽃 |
| Neutral | Stone | `stone-200`~`stone-800` | 텍스트, 비활성 |
| Background | Warm Gradient | `#FFF3E0 → #FFE0B2 → #C8E6C9` | body 배경 |

## Typography

| 용도 | 폰트 | 무게 | 크기 |
| ---- | ---- | ---- | ---- |
| Display/UI | Nunito | 800-900 (ExtraBold-Black) | h1: 3xl, h2: xl, h3: lg |
| 한글 Display | Jua | 400 (유일 무게) | fallback |
| 성경 본문 | Noto Serif KR | 400-700 | base |
| 숫자 강조 | Nunito | 900 (Black) | xl+ |

**규칙:** 모든 UI 텍스트는 `font-black` (900) 또는 `font-bold` (700). 얇은 글꼴 금지.

## Cards — 솔리드 시스템

```css
/* 기본 카드 */
.card {
  @apply bg-white rounded-2xl shadow-sm border-2 border-stone-200;
}

/* 피처드 카드 (메인 CTA) */
.card-featured {
  @apply bg-white rounded-3xl shadow-md border-2 border-stone-200;
}

/* 셀레브레이션 카드 */
.card-celebration {
  @apply bg-white rounded-3xl shadow-lg border-2 border-stone-200;
}
```

### Anti-patterns (금지)

- `bg-white/90`, `bg-white/80` — 반투명 배경 금지. `bg-white` 사용.
- `backdrop-blur-sm`, `backdrop-blur-md` — 블러 효과 금지.
- `bg-white/95 backdrop-blur-md` — 글래스모피즘 금지.

## Buttons — box-shadow 3D

듀오링고 시그니처 3D 버튼 구현:

```css
/* Primary CTA */
.btn-primary {
  @apply bg-gradient-to-b from-orange-400 to-orange-500 text-white font-black
         shadow-[0_4px_0_theme(colors.orange.600)] rounded-full
         transition-all hover:scale-105
         active:shadow-none active:translate-y-1;
}

/* Secondary */
.btn-secondary {
  @apply bg-white text-orange-500 font-black
         shadow-[0_4px_0_theme(colors.orange.200)] rounded-full
         transition-all hover:scale-105
         active:shadow-none active:translate-y-1;
}

/* Success */
.btn-success {
  @apply bg-emerald-500 text-white font-black
         shadow-[0_4px_0_theme(colors.emerald.700)] rounded-full
         transition-all hover:bg-emerald-600
         active:shadow-none active:translate-y-1;
}

/* Warning */
.btn-warning {
  @apply bg-amber-400 text-white font-black
         shadow-[0_4px_0_theme(colors.amber.600)] rounded-full
         transition-all hover:bg-amber-500
         active:shadow-none active:translate-y-1;
}

/* Ghost */
.btn-ghost {
  @apply bg-transparent text-stone-600 font-black rounded-full
         transition-colors hover:bg-stone-100 active:scale-95;
}

/* Disabled */
.btn-disabled {
  @apply bg-stone-200 text-stone-400 cursor-not-allowed
         shadow-[0_4px_0_theme(colors.stone.300)] rounded-full;
}
```

### Anti-patterns (금지)

- `border-b-4` — 3D 효과로 쓰지 않음. `box-shadow: 0 4px 0` 사용.
- `active:border-b-0` — box-shadow 시스템에서는 `active:shadow-none` 사용.

## Border Radius

| 단계 | 값 | 사용처 |
| ---- | -- | ------ |
| sm | `rounded-xl` (12px) | 태그, 뱃지, 아이콘 배경 |
| md | `rounded-2xl` (16px) | 카드, 입력, 컨테이너 |
| lg | `rounded-3xl` (24px) | 모달, 피처드 카드, 버튼 |
| full | `rounded-full` | 아바타, 버튼, 알약 |

## Shadows

| 단계 | 사용처 |
| ---- | ------ |
| `shadow-sm` | 일반 카드 |
| `shadow-md` | 피처드 카드, 떠있는 요소 |
| `shadow-lg` | 모달, 셀레브레이션 |
| `shadow-[0_4px_0_*]` | 3D 버튼 (box-shadow) |

## Animation — Spring Presets

motion/react 기반. CSS transition 아닌 spring physics.

| 프리셋 | stiffness | damping | 사용처 |
| ------ | --------- | ------- | ------ |
| fast | 300 | 30 | 탭, 클릭 피드백 |
| standard | 200 | 25 | 화면 전환, 카드 등장 |
| slow | 100 | 20 | 프로그래스 바, 로딩 |
| celebration | 150 | 15 | 바운스, 축하 효과 |

**규칙:** stagger 딜레이로 순차 등장. short=0.05s, medium=0.1s, long=0.15s.

## Component Patterns

### Quick Action — 세로 버튼 리스트

3-column 그리드 대신 세로 리스트. 각 버튼은 full-width, 큰 터치 타겟.

```
┌──────────────────────────────────┐
│ ✨ 추천 퍼즐 풀기              ❯ │
│    오늘의 말씀으로 퍼즐을!       │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│ 🔍 성경 66권 탐색              ❯ │
│    원하는 말씀을 찾아보세요       │
└──────────────────────────────────┘
┌──────────────────────────────────┐
│ 📚 테마 모음 8개               ❯ │
│    주제별로 말씀을 만나요         │
└──────────────────────────────────┘
```

### Verse Card — 가로 스크롤

```
┌─────────┐ ┌─────────┐ ┌─────────┐
│ w: 176px│ │         │ │         │
│ 구절 참조│ │         │ │         │
│ 본문 2줄│ │         │ │         │
│ 완료 뱃지│ │         │ │         │
└─────────┘ └─────────┘ └─────────┘
```

### Bottom Feedback Sheet

정답/오답 시 하단에서 올라오는 시트.
- 정답: `bg-emerald-100` + emerald 아이콘
- 오답: `bg-amber-50` + amber 아이콘
- border-top 대신 `shadow-[0_-2px_10px_rgba(0,0,0,0.1)]` 사용

## Empty States

빈 상태는 기능이다. "데이터 없음"은 디자인이 아님.

| 화면 | 이모지 | 메시지 | CTA |
| ---- | ------ | ------ | --- |
| 최근 말씀 | 📖 | 아직 만난 말씀이 없어요 | 첫 퍼즐 시작하기 |
| 좋아하는 말씀 | 💛 | 마음에 드는 말씀을 저장해보세요 | 말씀 탐색하기 |
| 업적 | 🏆 | 첫 업적이 기다리고 있어요! | 퍼즐로 시작하기 |
| 복습 알림 | 🌱 | 복습할 말씀이 아직 없어요 | 새 말씀 배우기 |
| 컬렉션 진행 | 📚 | 아직 시작하지 않았어요 | 첫 테마 고르기 |

### Empty State 스타일

```
┌──────────────────────────────┐
│         bg-{color}-50        │
│                              │
│          📖 (48px)           │
│                              │
│   아직 만난 말씀이 없어요     │ ← body font, stone-600
│   퍼즐을 풀면 여기에 모여요   │ ← bodySmall, stone-400
│                              │
│   ┌────────────────────┐     │
│   │  첫 퍼즐 시작하기   │     │ ← ghost/outline 버튼
│   └────────────────────┘     │
│                              │
└──────────────────────────────┘
```

## Design Tokens Reference

모든 토큰은 `src/design/tokens.ts`에서 관리.

**수정 필요 항목:**
- `colors.surface.card`: `'bg-white/90 backdrop-blur-sm'` → `'bg-white'`
- `colors.surface.overlay`: `'bg-black/30 backdrop-blur-sm'` → `'bg-black/50'` (오버레이만 반투명 허용)
- `button3d.active`: `'border-b-4 ...'` → `'shadow-[0_4px_0_...] ...'`
- `presets.card`: backdrop-blur 제거
- `presets.scrollItem`: `border-b-4` → `shadow-[0_4px_0_...]`

## Anti-patterns (전체 목록)

코드에서 다음 패턴을 발견하면 즉시 수정:

| 패턴 | 이유 | 대안 |
| ---- | ---- | ---- |
| `backdrop-blur-sm/md` | 듀오링고는 솔리드 배경 사용 | 제거 |
| `bg-white/90`, `bg-white/80` | 반투명 카드는 글래스모피즘 | `bg-white` |
| `border-b-4` (3D 효과용) | 레이아웃 시프트 유발 | `shadow-[0_4px_0_*]` |
| `border-t-4` (피드백 시트) | 두꺼운 보더보다 shadow | `shadow-[0_-2px_10px_*]` |
| 3-column 아이콘+텍스트 그리드 | AI slop 패턴 #2 | 세로 버튼 리스트 |
| `text-align: center` 남용 | 모든 것 센터 정렬 | left-align 기본 |

## Home Screen — 재설계 (v2)

### 설계 원칙

1. **JOY가 비주얼 앵커** — 홈을 열면 JOY가 먼저 보임. 뒤오링고=Duo, 워터라마=라마.
2. **1초 안에 "오늘 뭐 해야 하는지"** — Primary CTA 하나. 카드 나열 금지.
3. **별 모으기 = 데일리 골** — 진행 바 대신 별이 채워지는 시각적 메타포.
4. **알약 버튼 = 보조 액션** — 세로 카드 나열 대신 가로 스크롤 알약.

### 레이아웃 구조

```
┌─────────────────────────────────────────┐
│  🔥 3일   ⭐ 120   🌱 Lv.2 줄기  [👤] │  ← LAYER 1: 상단 바
├─────────────────────────────────────────┤
│                                         │
│           (JOY 마스코트 120x120)        │  ← LAYER 2: 히어로 존
│     ┌───────────────────────┐           │
│     │ "오늘 2개 더 풀면     │           │     말풍선 (상태별 메시지)
│     │  목표 달성이야!"      │           │
│     └───────────────────────┘           │
│          ★ ★ ☆  (2/3)                  │     별 모으기 (데일리 골)
│                                         │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │  📖 요한복음 3:16                   │ │  ← LAYER 3: Primary CTA
│ │  "하나님이 세상을 이처럼..."         │ │     (오늘의 말씀 + 퍼즐 통합)
│ │  ┌───────────────────────────────┐  │ │
│ │  │      🎮 퍼즐로 만나기          │  │ │     btn-primary 내장
│ │  └───────────────────────────────┘  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [🔄복습 3개] [📚테마] [❤️좋아하는]     │  ← Quick Pills (가로 스크롤)
│                                         │
│ 🕐 최근 말씀 (가로 스크롤 카드)         │  ← 조건부 (Empty State 포함)
│                                         │
├─────────────────────────────────────────┤
│  🏠 홈   │   📖 탐색   │   👤 프로필   │  ← LAYER 0: 하단 탭 바
└─────────────────────────────────────────┘
```

### LAYER 1: 상단 바 (StatusBar)

- 배경: transparent (body gradient 위에)
- 높이: 48px, 좌우 패딩 16px
- **스트릭**: `🔥` + 숫자 + "일" — `text-sm font-black text-orange-500`
- **XP**: `⭐` + 총 XP — `text-sm font-black text-amber-500`
- **레벨**: 이모지 + "Lv.N 이름" — `text-sm font-black text-violet-500`
- **프로필**: 오른쪽 끝, 36x36 원형 — `bg-white border-2 border-violet-100 rounded-full`

### LAYER 2: 히어로 존 (JOY Zone)

**JOY 마스코트:**
- 크기: 120x120px
- 이미지: `public/image01.png` (Default Smile) 기본, 상태별 교체
- 뒤 배경: `bg-amber-50/40` 원형 radial gradient (은은한 빛)
- 등장 애니메이션: `spring { stiffness: 200, damping: 20 }`

**포즈 & 말풍선 로직:**

| 조건 (우선순위 순) | 포즈 | 말풍선 |
|-------------------|------|--------|
| `isDailyGoalMet` | Excited Celebration | "오늘 목표 달성! 대단해!" |
| `streak >= 7` | Proud Reward | "벌써 {streak}일째! 멋져!" |
| `remainingReviews > 0` | Focused Puzzle-Solving | "다시 만날 말씀이 {N}개 있어!" |
| `todayCompletions > 0` | Encouraging Support | "{남은 수}개 더 풀면 목표 달성!" |
| `totalCompleted === 0` (새 사용자) | Default Smile | "첫 퍼즐을 풀어볼까?" |
| default (첫 방문) | Default Smile | "{인사말}" |

**말풍선:**
- `bg-white rounded-2xl shadow-sm border-2 border-amber-100 px-4 py-2.5`
- 텍스트: `text-sm font-black text-stone-700`
- CSS triangle 꼬리 (JOY 방향)
- 등장: `fadeInUp` delay 0.2s

**별 모으기 (Daily Stars):**
- 별 수 = `dailyGoal` (기본 3개)
- 채워진 별: `text-amber-400 fill-current` + drop-shadow glow
- 빈 별: `text-stone-200 stroke-current fill-none`
- 별 크기: 28px, 간격: 8px
- 채워질 때 애니메이션: `spring { scale: [0, 1.3, 1], rotate: [0, 15, 0] }` + sparkle 4개
- 전부 채워지면: 모든 별 동시 pulse + JOY Excited + confetti
- 아래 텍스트: `text-xs font-bold text-stone-400` "목표까지 N개 남았어!" / "목표 달성!"

### LAYER 3: 액션 존

**Primary CTA — 오늘의 퍼즐 카드:**
- 카드: `card-featured` + `border-amber-200` (복습이면 `border-emerald-200`)
- 구절 뱃지: `bg-amber-100 text-amber-800 rounded-full px-3 py-1 font-bold text-sm`
- 복습 뱃지: `bg-emerald-100 text-emerald-800`
- 관심 뱃지: `bg-violet-100 text-violet-700 text-xs`
- 본문: `text-base font-bold text-stone-700 leading-relaxed line-clamp-2`
- **내장 CTA**: `btn-primary w-full py-3.5 text-base font-black mt-3`
- 카드 전체도 탭 가능 (`whileTap={{ scale: 0.98 }}`)

**Quick Access Pills:**
- 가로 스크롤, gap-2.5, 좌우 패딩 16px
- 각 알약: `bg-white rounded-full px-4 py-2.5 border-2 border-stone-100 shadow-[0_3px_0_theme(colors.stone.200)]`
- 아이콘: 16px + gap-1.5 + 텍스트
- 텍스트: `text-sm font-black text-stone-700`
- 복습 숫자 뱃지: `bg-emerald-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center`
- 고정 알약 목록: 복습(조건부), 테마 모음, 좋아하는(조건부)
- 복습 0개 → 숨김, 좋아하는 0개 → 숨김

**최근 말씀 (기존 유지 + Empty State):**
- 기존 가로 스크롤 카드 유지
- **Empty State** (recentVerses.length === 0):
  - `bg-amber-50 rounded-2xl p-6 text-center`
  - JOY (Encouraging Support) 이미지 60x60
  - "아직 만난 말씀이 없어요" — `text-sm font-bold text-stone-600`
  - "퍼즐을 풀면 여기에 모여요" — `text-xs font-bold text-stone-400`

### LAYER 0: 하단 탭 바 (BottomTabBar)

**새 컴포넌트: `src/components/ui/BottomTabBar.tsx`**

- 위치: `fixed bottom-0 left-0 right-0`
- 배경: `bg-white border-t-2 border-stone-100`
- 높이: `64px + env(safe-area-inset-bottom)`
- 3탭 균등 분할 (`grid grid-cols-3`)

**탭 요소:**
- 아이콘: 24px (Home, BookOpen, User from lucide-react)
- 라벨: `text-xs mt-0.5`
- 활성: `text-orange-500 font-black` + 하단 인디케이터 (`bg-orange-400 rounded-full w-6 h-[3px]`)
- 비활성: `text-stone-400 font-bold`
- 탭 전환: 아이콘 `spring { scale: [1, 1.15, 1] }`

**표시 조건:**
- 표시: `home`, `select-bible`, `profile`, `collection-list`, `collection-detail`
- 숨김: `playing`, `custom-playing`, `result`, `custom-complete`, `reading`, `memorizing`, `difficulty`, `select-mode`, `onboarding`, `collection-playing`, `collection-complete`

**탭 → GameState 매핑:**
- 🏠 홈 → `setGameState('home')`
- 📖 탐색 → `setGameState('select-bible')`
- 👤 프로필 → `setGameState('profile')`

### 삭제되는 요소

기존 Dashboard에서 제거:
1. ~~인사말 텍스트 ("좋은 아침이에요")~~ → JOY 말풍선으로 대체
2. ~~보라색 프로그레스 바~~ → 별 모으기로 대체
3. ~~프로필 버튼 (우상단)~~ → 하단 탭 바로 이동
4. ~~"추천 퍼즐 풀기" 세로 카드~~ → 오늘의 말씀 카드에 통합
5. ~~"성경 66권 탐색" 세로 카드~~ → 하단 탭 바 "탐색"으로 이동
6. ~~"테마 모음 8개" 세로 카드~~ → Quick Pill로 축소
7. ~~좋아하는 말씀 가로 스크롤~~ → Quick Pill로 축소
8. ~~InstallPrompt 위치~~ → 히어로 존 아래로 이동 (또는 제거)

### JOY 마스코트 통합 가이드

**이미지 에셋:**
- `public/joy-default.png` — Default Smile (홈 기본)
- `public/joy-excited.png` — Excited Celebration (목표 달성)
- `public/joy-support.png` — Encouraging Support (빈 상태)
- `public/joy-focused.png` — Focused Puzzle-Solving (복습/퍼즐)
- `public/joy-proud.png` — Proud Reward (스트릭 7일+)
- `public/joy-comfort.png` — Gentle Comforting (오답 화면)

**현재 에셋:** `image01.png` (6포즈 시트), `image02.png`, `image03.png` (단일 포즈)
→ 개별 포즈 이미지를 크롭하여 위 파일명으로 준비 필요.
→ 임시로 `image02.png`를 모든 포즈에 사용 가능.

## Navigation — 하단 탭 바

하단 탭 바를 통한 3-tab 네비게이션 시스템.

```
┌───────────┬───────────┬───────────┐
│  🏠 홈    │  📖 탐색  │  👤 프로필 │
└───────────┴───────────┴───────────┘
```

- 메인 화면(홈/탐색/프로필/컬렉션)에서만 표시
- 퍼즐/결과/독서 등 몰입 화면에서는 숨김
- 상세 스펙은 "Home Screen — 재설계 (v2)" 섹션의 LAYER 0 참조
