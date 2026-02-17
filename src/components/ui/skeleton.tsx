import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-foreground/20 border border-foreground/10 shadow-sm", className)}
      {...props}
    />
  )
}

export { Skeleton }
