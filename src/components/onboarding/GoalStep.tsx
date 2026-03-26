import { Turtle, Rabbit, Bird } from 'lucide-react';
import { SelectionOption, SelectionStep } from './SelectionStep';

interface Props {
  onSelect: (goal: number) => void;
}

const goals: SelectionOption<number>[] = [
  {
    value: 1,
    label: '1구절',
    desc: '가볍게',
    icon: Turtle,
    accentClassName: 'bg-emerald-50 text-emerald-500',
  },
  {
    value: 3,
    label: '3구절',
    desc: '꾸준히',
    icon: Rabbit,
    accentClassName: 'bg-amber-50 text-amber-500',
    badge: '추천',
  },
  {
    value: 5,
    label: '5구절',
    desc: '도전!',
    icon: Bird,
    accentClassName: 'bg-sky-50 text-sky-500',
  },
];

export function GoalStep({ onSelect }: Props) {
  return (
    <SelectionStep
      title="하루에 몇 구절 배울까요?"
      description="부담 없이 시작하고, 나중에 언제든 다시 바꿀 수 있어요."
      options={goals}
      onSelect={onSelect}
    />
  );
}
