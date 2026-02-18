'use client';

import { useTranslate } from '@tolgee/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusFilterProps<T extends string> {
  options: readonly T[] | T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  getLabel?: (option: T) => string;
}

export function StatusFilter<T extends string>({
  options,
  value,
  onChange,
  className,
  containerClassName,
  fullWidth = false,
  getLabel,
}: StatusFilterProps<T>) {
  const { t } = useTranslate();

  return (
    <div
      className={cn(
        'flex-none flex gap-1 p-1 bg-card/50 backdrop-blur-md rounded-xl border max-w-full overflow-x-auto no-scrollbar',
        containerClassName
      )}
    >
      {options.map(option => (
        <Button
          key={option}
          variant="ghost"
          size="sm"
          onClick={() => onChange(option)}
          className={cn(
            'rounded-lg px-4 h-9 font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap',
            fullWidth && 'w-full',
            value === option
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'text-muted-foreground hover:bg-white/5',
            className
          )}
        >
          {getLabel ? getLabel(option) : t(option, option)}
        </Button>
      ))}
    </div>
  );
}
