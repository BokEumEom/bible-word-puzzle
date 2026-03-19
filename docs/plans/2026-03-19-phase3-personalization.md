# Phase 3: 개인화 추천 & 게이미피케이션

## 목표
온보딩에서 수집한 데이터(레벨, 관심 성경, 일일 목표)를 실제 사용자 경험에 반영하여 "나만을 위한 앱" 느낌 완성. Duolingo의 핵심인 **적응형 추천 + 성취감 루프**를 구현.

## 현재 상태 (Phase 2 완료)

| 수집 데이터 | 현재 활용 | Phase 3 활용 |
|------------|----------|-------------|
| level | 미사용 | 난이도 자동 선택, 추천 구절 필터링 |
| interests | BibleSelector 상단 표시 | 오늘의 말씀, 스마트 추천 |
| dailyGoal | DailyGoalBadge | XP 시스템, 주간 리포트 |
| completedVerses | 완료 카운트 표시 | 복습 스케줄링, 마스터 판정 |

---

## Phase 3A: 스마트 추천 시스템

### 3A-1. 오늘의 말씀 개인화
**현재**: 날짜 seed로 presetVerses에서 고정 선택
**변경**: interests 기반 + 완료하지 않은 구절 우선

```
추천 알고리즘:
1. interests 책에서 미완료 구절 → 최우선
2. interests 책에서 1회만 완료 → 복습 후보
3. 전체 presetVerses 중 레벨 맞는 미완료 → 차선
4. 폴백: 기존 날짜 seed 로직
```

**파일**: `src/utils/recommendation.ts` (신규)

### 3A-2. 추천 말씀 퍼즐 레벨 자동 선택
**현재**: DifficultySelector에서 매번 수동 선택
**변경**: 온보딩 level로 자동 선택 (변경 가능)

- DifficultySelector에 `defaultLevel?: Difficulty` prop 추가
- 해당 레벨 카드에 "나의 레벨" 배지 표시
- 탭하면 바로 시작 (기존과 동일)

### 3A-3. Dashboard "다음 할 일" 섹션
**신규**: 스마트 카드로 다음 액션 제안

```
+-----------------------------------------+
| 📌 다음으로 이걸 해보세요                    |
|                                         |
| [복습] 요한복음 3:16 — 3일 전 배웠어요       |
| [새말씀] 시편 23:1 — 관심 성경이에요         |
| [도전] 로마서 8:28 — 한 단계 올려볼까요?     |
+-----------------------------------------+
```

카드 타입:
- **복습 카드** (emerald): 완료한 지 2일+ 된 구절
- **새 말씀 카드** (amber): interests 기반 미완료 구절
- **도전 카드** (violet): 현재 레벨보다 한 단계 위 구절

**파일**: `src/components/NextActionCard.tsx` (신규)

---

## Phase 3B: XP & 레벨 시스템

### 3B-1. XP 포인트
구절 완료 시 XP 획득:

| 행동 | XP |
|------|-----|
| 구절 퍼즐 완료 | 10 |
| 힌트 없이 완료 | +5 보너스 |
| 일일 목표 달성 | +15 보너스 |
| 연속 학습 (스트릭) | streak × 2 보너스 |
| 복습 완료 | 5 |

### 3B-2. 레벨 시스템
XP 기반 자동 레벨업:

```
Lv.1  새싹     0~49 XP     🌱
Lv.2  줄기     50~149 XP   🌿
Lv.3  나무     150~299 XP  🌳
Lv.4  열매     300~499 XP  🍎
Lv.5  빛       500+ XP     ✨
```

- Dashboard에 레벨 뱃지 + XP 프로그레스바 표시
- 레벨업 시 축하 모달 (DailyGoalCelebration과 유사)

### 3B-3. 데이터 모델 확장

```typescript
interface UserProgress {
  // ... 기존 필드 ...
  xp: number;
  level: number; // 1~5
  // 복습 시스템
  reviewSchedule: ReviewItem[];
}

interface ReviewItem {
  verseId: string;
  lastCompleted: string; // ISO date
  completionCount: number;
  nextReviewDate: string; // ISO date
}
```

**파일**: `src/hooks/useUserProgress.ts` (수정)

---

## Phase 3C: 성취 배지 시스템

### 배지 목록

| 배지 | 조건 | 아이콘 |
|------|------|--------|
| 첫 발걸음 | 첫 구절 완료 | 👣 |
| 꾸준함의 힘 | 7일 연속 학습 | 🔥 |
| 말씀 수집가 | 10개 구절 완료 | 📚 |
| 암기왕 | 구절 5개 힌트 없이 완료 | 🧠 |
| 성경 탐험가 | 3개 이상 성경 책 학습 | 🗺️ |
| 복습의 달인 | 복습 10회 완료 | 🔄 |
| 목표 달성자 | 일일 목표 7일 연속 달성 | 🎯 |
| 말씀의 빛 | Lv.5 달성 | ✨ |

### 배지 UI
- Dashboard에 "내 배지" 섹션 추가
- 미획득 배지는 회색 실루엣으로 표시 (동기 부여)
- 획득 시 축하 토스트 알림

**파일**:
- `src/data/badges.ts` (신규): 배지 정의
- `src/components/BadgeGrid.tsx` (신규): 배지 그리드 UI
- `src/components/BadgeToast.tsx` (신규): 획득 알림

---

## Phase 3D: 복습 시스템 (Spaced Repetition Lite)

### 복습 스케줄
간단한 간격 반복:

```
1회 완료 → 1일 후 복습
2회 완료 → 3일 후 복습
3회 완료 → 7일 후 복습
4회+ 완료 → "마스터" (복습 불필요)
```

### Dashboard 통합
- "오늘 복습할 말씀" 섹션 (복습 예정일 ≤ 오늘)
- 복습 카드에 "🔄 복습" 배지 표시
- 복습 완료 시 XP 5 획득

### 마스터 구절
4회 이상 완료된 구절:
- 금색 체크 마크 ✅ → ⭐
- BibleSelector에서 마스터 구절 하이라이트

**파일**: `src/utils/reviewSchedule.ts` (신규)

---

## Phase 3E: 주간 리포트

### 주간 요약 모달
월요일 앱 접속 시 자동 표시:

```
+-----------------------------------------+
| 📊 지난 주 리포트                          |
|                                         |
| 완료한 구절: 15개  (+5 from last week)    |
| 획득 XP: 180 (+40)                       |
| 최장 스트릭: 7일 🔥🔥🔥🔥🔥🔥🔥             |
| 가장 많이 공부한 책: 시편 (8구절)            |
|                                         |
| [이번 주도 화이팅!]                        |
+-----------------------------------------+
```

**파일**: `src/components/WeeklyReport.tsx` (신규)

---

## 구현 순서 (우선순위)

```
Phase 3A (스마트 추천) ←── 즉시 체감, 온보딩 데이터 활용 핵심
  ├─ 3A-1. 오늘의 말씀 개인화
  ├─ 3A-2. 난이도 자동 선택
  └─ 3A-3. "다음 할 일" 카드

Phase 3B (XP & 레벨) ←── 장기 동기 부여, 리텐션 핵심
  ├─ 3B-1. XP 포인트 시스템
  ├─ 3B-2. 레벨 + 레벨업 축하
  └─ 3B-3. 데이터 모델 확장

Phase 3D (복습 시스템) ←── 학습 효과 극대화
  ├─ 간격 반복 스케줄
  ├─ Dashboard 복습 섹션
  └─ 마스터 구절

Phase 3C (배지) ←── 수집 욕구 + 마일스톤
  ├─ 배지 정의 & 판정 로직
  ├─ 배지 그리드 UI
  └─ 획득 토스트

Phase 3E (주간 리포트) ←── 회고 + 자랑 가능
  └─ 주간 요약 모달
```

---

## 예상 파일 변경

### 신규 파일 (8)
- `src/utils/recommendation.ts` — 추천 알고리즘
- `src/utils/reviewSchedule.ts` — 복습 스케줄 계산
- `src/utils/xp.ts` — XP 계산 로직
- `src/data/badges.ts` — 배지 정의
- `src/data/levels.ts` — 레벨 정의
- `src/components/NextActionCard.tsx` — 다음 액션 추천 UI
- `src/components/BadgeGrid.tsx` — 배지 그리드
- `src/components/WeeklyReport.tsx` — 주간 리포트

### 수정 파일 (5)
- `src/types/index.ts` — ReviewItem, Badge 타입 추가
- `src/hooks/useUserProgress.ts` — xp, level, reviewSchedule 추가
- `src/components/Dashboard.tsx` — 추천/복습/배지 섹션 추가
- `src/components/DifficultySelector.tsx` — defaultLevel prop
- `src/App.tsx` — XP 계산, 주간 리포트 게이트
