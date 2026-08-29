import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

const variants = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
}

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: '',
  lg: 'text-base px-5 py-3',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, children, loading, disabled, icon: Icon, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(variants[variant], sizes[size], className, (disabled || loading) && 'opacity-60 cursor-not-allowed')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={15} />
      ) : null}
      {children}
    </motion.button>
  )
})

export default Button
