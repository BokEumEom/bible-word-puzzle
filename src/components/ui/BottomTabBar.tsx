import { motion } from 'motion/react';
import { Home, Library, BookOpen, User } from 'lucide-react';
import { GameState } from '../../types';

type TabId = 'home' | 'collection-list' | 'select-bible' | 'profile';

interface Tab {
  readonly id: TabId;
  readonly icon: typeof Home;
  readonly label: string;
}

const tabs: readonly Tab[] = [
  { id: 'home', icon: Home, label: '홈' },
  { id: 'collection-list', icon: Library, label: '테마' },
  { id: 'select-bible', icon: BookOpen, label: '탐색' },
  { id: 'profile', icon: User, label: '프로필' },
] as const;

const TAB_INDEX: Record<TabId, number> = {
  'home': 0,
  'collection-list': 1,
  'select-bible': 2,
  'profile': 3,
};

const VISIBLE_STATES: ReadonlySet<GameState> = new Set([
  'home',
  'select-bible',
  'profile',
  'collection-list',
  'collection-detail',
]);

function getActiveTab(gameState: GameState): TabId {
  if (gameState === 'collection-list' || gameState === 'collection-detail') return 'collection-list';
  if (gameState === 'select-bible') return 'select-bible';
  if (gameState === 'profile') return 'profile';
  return 'home';
}

interface Props {
  readonly gameState: GameState;
  readonly onNavigate: (target: GameState) => void;
}

export function BottomTabBar({ gameState, onNavigate }: Props) {
  if (!VISIBLE_STATES.has(gameState)) return null;

  const activeTab = getActiveTab(gameState);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-stone-100 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 relative"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon
                  size={22}
                  className={isActive ? 'text-orange-500' : 'text-stone-400'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span
                className={`text-[10px] ${isActive ? 'text-orange-500 font-black' : 'text-stone-400 font-bold'}`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-0.5 bg-orange-400 rounded-full w-5 h-[3px]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Get tab index for directional transitions */
export function getTabIndex(gameState: GameState): number {
  const tab = getActiveTab(gameState);
  return TAB_INDEX[tab] ?? 0;
}
