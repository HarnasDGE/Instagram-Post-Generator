import React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {children}
        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
