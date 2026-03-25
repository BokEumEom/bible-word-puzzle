import { motion, HTMLMotionProps } from 'motion/react';
import { LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'ghost' | 'disabled';
type Size = 'sm' | 'md' | 'lg';

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  readonly variant: Variant;
  readonly size?: Size;
  readonly icon?: LucideIcon;
  readonly children: React.ReactNode;
  readonly delay?: number;
  readonly fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  warning: 'btn-warning',
  ghost: 'btn-ghost',
  disabled: 'btn-disabled',
};

const sizeClass: Record<Size, { button: string; icon: number }> = {
  sm: { button: 'py-3 text-base', icon: 20 },
  md: { button: 'py-4 text-lg', icon: 24 },
  lg: { button: 'py-5 text-xl', icon: 28 },
};

/**
 * 3D 액션 버튼 — 듀오링고 시그니처 box-shadow 스타일.
 * 모든 CTA에 이 컴포넌트를 사용하여 일관된 버튼 시스템을 유지합니다.
 */
export function ActionButton({
  variant,
  size = 'md',
  icon: Icon,
  children,
  delay = 0,
  fullWidth = true,
  disabled,
  ...rest
}: Props) {
  const resolvedVariant = disabled ? 'disabled' : variant;
  const { button: sizeBtn, icon: iconSize } = sizeClass[size];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      className={`${variantClass[resolvedVariant]} ${sizeBtn} ${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2`}
      {...rest}
    >
      {Icon && <Icon size={iconSize} />}
      {children}
    </motion.button>
  );
}
