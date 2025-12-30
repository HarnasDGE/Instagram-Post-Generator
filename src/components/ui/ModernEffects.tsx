import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  className?: string;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0 -z-10 overflow-hidden', className)}>
      {/* Animated gradient blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
    </div>
  );
};

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl',
        'hover:bg-white/40 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  className,
}) => {
  return (
    <div
      className={cn('animate-float', className)}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export const GridPattern: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #80808012 1px, transparent 1px),
            linear-gradient(to bottom, #80808012 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'relative overflow-hidden px-6 py-3 rounded-lg font-semibold',
        'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000',
        'transform hover:scale-105 transition-transform duration-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
