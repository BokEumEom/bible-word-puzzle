import { Difficulty } from '../../types';
import { Sprout, TreePine, Trees } from 'lucide-react';
import { SelectionOption, SelectionStep } from './SelectionStep';

interface Props {
  onSelect: (level: Difficulty) => void;
}

const levels: SelectionOption<Difficulty>[] = [
  {
    value: 'beginner',
    label: '이제 막 시작해요',
    desc: '성경이 처음이에요',
    icon: Sprout,
    accentClassName: 'bg-emerald-50 text-emerald-500',
  },
  {
    value: 'easy',
    label: '주일학교에서 배웠어요',
    desc: '어느 정도 알고 있어요',
    icon: TreePine,
    accentClassName: 'bg-amber-50 text-amber-500',
  },
  {
    value: 'normal',
    label: '매일 말씀을 읽어요',
    desc: '성경을 잘 알아요',
    icon: Trees,
    accentClassName: 'bg-sky-50 text-sky-500',
  },
];

export function LevelStep({ onSelect }: Props) {
  return (
    <SelectionStep
      title="성경 말씀을 얼마나 접해봤나요?"
      description="지금 수준에 맞는 시작점을 바로 골라드릴게요."
      options={levels}
      onSelect={onSelect}
    />
  );
}
