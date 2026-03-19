import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  active: boolean;
}

const COLORS = ['bg-amber-400', 'bg-emerald-400', 'bg-violet-400', 'bg-orange-400', 'bg-rose-400'];
const PARTICLE_COUNT = 24;

interface Particle {
  readonly id: number;
  readonly angle: number;
  readonly distance: number;
  readonly size: number;
  readonly color: string;
  readonly delay: number;
  readonly rotation: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function ConfettiBurst({ active }: Props) {
  const particles = useMemo((): readonly Particle[] => {
    const rand = seededRandom(42);
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      angle: (360 / PARTICLE_COUNT) * i + rand() * 30,
      distance: 80 + rand() * 120,
      size: 6 + rand() * 6,
      color: COLORS[i % COLORS.length],
      delay: rand() * 0.2,
      rotation: rand() * 360,
    }));
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                scale: 0,
                opacity: 0,
                rotate: p.rotation,
              }}
              transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
              className={`absolute rounded-sm ${p.color}`}
              style={{
                width: p.size,
                height: p.size,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
