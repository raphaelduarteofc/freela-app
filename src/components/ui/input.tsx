import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-label text-ink-soft font-medium"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-muted">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-ink-border bg-white px-3 py-2',
              'text-body-1 text-ink placeholder:text-ink-subtle',
              'transition-colors',
              'hover:border-ink-subtle',
              'focus:outline-none focus:border-brand focus:shadow-focus',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ink-surface',
              'read-only:bg-ink-surface read-only:cursor-default',
              leftIcon  && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-red-400 focus:border-red-500 focus:shadow-none',
              className,
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-3 flex items-center text-ink-muted">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-caption text-red-600">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-caption text-ink-muted">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
