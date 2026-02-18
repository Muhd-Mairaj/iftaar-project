import * as React from "react"
import { Input } from "@/components/ui/input"

const NumberInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
    onChange?: (value: number | '') => void
  }
>(({ onChange, onKeyDown, value, ...props }, ref) => {
  return (
    <Input
      type="number"
      {...props}
      ref={ref}
      value={value?.toString().trim() || ''}
      onKeyDown={(e) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
        onKeyDown?.(e);
      }}
      onChange={(e) => {
        const val = e.target.value;
        onChange?.(val === '' ? 0 : Number.parseInt(val, 10));
      }}
    />
  );
})
NumberInput.displayName = "NumberInput"

export { NumberInput }
