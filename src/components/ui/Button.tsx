import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { buttonStyles, type ButtonSize, type ButtonVariant } from './buttonStyles'
import { Spinner } from './Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles(variant, size, className)}
      {...props}
    >
      {loading && <Spinner label="" className="h-4 w-4" />}
      {children}
    </button>
  )
})
