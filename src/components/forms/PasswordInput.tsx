import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input, type InputProps } from '@/components/ui/Input'

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'endAdornment'>>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false)
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        endAdornment={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-muted hover:text-fg"
          >
            {visible ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}
          </button>
        }
        {...props}
      />
    )
  },
)
