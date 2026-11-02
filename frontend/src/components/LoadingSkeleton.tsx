import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      className={cn('rounded-lg bg-slate-200 dark:bg-slate-800', className)}
    />
  )
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />)}
    </div>
  )
}

export function ChartSkeleton() {
  return <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-900 animate-pulse" />
      ))}
    </div>
  )
}
