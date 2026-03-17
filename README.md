<div align="center">

# 말씀 팡팡 퍼즐

어린이를 위한 성경 단어 퍼즐 게임

드래그앤드롭으로 성경 구절을 맞추며 말씀을 배워요!

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

</div>

## 주요 기능

### 퍼즐 모드

- 난이도별 프리셋 퍼즐 (처음이에요 / 쉬워요 / 잘해요)
- 22개 큐레이션된 성경 구절
- 드래그앤드롭 & 클릭으로 단어 배치
- 정답 시 애니메이션 + 컨페티 효과

### 성경 탐색

- 구약/신약 계층 탐색 (성경 → 장 → 절)
- 10권 수록 (창세기, 시편, 잠언, 마태복음, 로마서 등)
- 완료한 구절 뱃지 표시

### 3가지 학습 모드

- 읽기 - 큰 글씨 + TTS 음성 지원
- 암기 - 단어 가리기/보이기 토글
- 퍼즐 - 드래그앤드롭 단어 맞추기

### 진행 추적

- 연속 학습 스트릭
- 즐겨찾기 구절 저장
- 최근 학습 구절 기록
- localStorage 기반 자동 저장

## 기술 스택

| 분류       | 기술                     |
| ---------- | ------------------------ |
| 프레임워크 | React 19, TypeScript 5.8 |
| 빌드       | Vite 6                   |
| 스타일링   | Tailwind CSS 4           |
| 애니메이션 | Framer Motion 12         |
| 아이콘     | Lucide React             |
| 효과       | Canvas Confetti          |
| 폰트       | Nunito, Jua              |

## 시작하기

필수: Node.js 18+

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

<http://localhost:3000> 에서 확인할 수 있습니다.

## 스크립트

| 명령어            | 설명                       |
| ----------------- | -------------------------- |
| `npm run dev`     | 개발 서버 실행 (포트 3000) |
| `npm run build`   | 프로덕션 빌드              |
| `npm run preview` | 빌드 결과 미리보기         |
| `npm run lint`    | TypeScript 타입 체크       |
| `npm run clean`   | 빌드 결과물 삭제           |

## 프로젝트 구조

```text
src/
├── components/        # UI 컴포넌트
│   ├── App.tsx           # 메인 상태 관리
│   ├── Dashboard.tsx     # 홈 화면
│   ├── BibleSelector.tsx # 성경 탐색 네비게이션
│   ├── VersePuzzleBoard.tsx # 퍼즐 게임 보드
│   ├── ReadingScreen.tsx    # 읽기 모드
│   ├── MemorizeScreen.tsx   # 암기 모드
│   ├── ModeSelector.tsx     # 학습 모드 선택
│   ├── DifficultySelector.tsx # 난이도 선택
│   ├── ProgressHeader.tsx   # 진행 상태 헤더
│   └── ResultScreen.tsx     # 결과 화면
├── data/
│   ├── verses.ts      # 프리셋 퍼즐 구절 (22개)
│   └── bible.ts       # 한국어 성경 데이터 (10권)
├── hooks/
│   └── useUserProgress.ts  # 사용자 진행 상태 관리
├── types/
│   └── index.ts       # 타입 정의
├── index.css          # 글로벌 스타일
└── main.tsx           # 엔트리 포인트
```
