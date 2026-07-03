import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/types'

interface AppBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const AppBreadcrumb = memo(function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('hidden md:flex items-center gap-1.5 text-sm', className)}
    >
      <Link
        to="/app"
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Início"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
      </Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
          {item.href ? (
            <Link
              to={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
})
