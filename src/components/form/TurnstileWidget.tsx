import React, { useEffect, useRef } from 'react';
import { TURNSTILE_CONFIG } from '@/config/constants';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  theme?: 'light' | 'dark';
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({ onSuccess, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const loadTurnstile = () => {
      if (!containerRef.current) return;

      // Check if Turnstile is loaded
      if (window.turnstile) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_CONFIG.siteKey,
          callback: onSuccess,
          'error-callback': onError,
          theme: TURNSTILE_CONFIG.theme,
        });
      } else {
        // Wait for Turnstile to load
        window.onTurnstileLoad = () => {
          if (containerRef.current && window.turnstile) {
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
              sitekey: TURNSTILE_CONFIG.siteKey,
              callback: onSuccess,
              'error-callback': onError,
              theme: TURNSTILE_CONFIG.theme,
            });
          }
        };
      }
    };

    // Load the Turnstile script
    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      loadTurnstile();
    }

    return () => {
      // Cleanup
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [onSuccess, onError]);

  return (
    <div>
      <div ref={containerRef} className="flex justify-start" />
      <p className="mt-2 text-xs text-gray-500">
        Ta strona jest chroniona przez Cloudflare Turnstile
      </p>
    </div>
  );
};
