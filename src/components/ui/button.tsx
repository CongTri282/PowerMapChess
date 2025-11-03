import React from 'react';
import './button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-size-${size}`;
    const classes = `btn ${variantClass} ${sizeClass} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
