import * as React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = 'button' // Simplified: removed Slot dependency for now to minimize install
    
    const variantClass = `btn-${variant}`
    const sizeClass = size === 'default' ? 'btn-md' : `btn-${size}`

    return (
      <Comp
        className={cn(
            'btn',
            variantClass,
            sizeClass,
            className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
