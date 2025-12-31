import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  comingSoon?: boolean;
}

const services: Service[] = [
  {
    id: 'instagram',
    name: 'Instagram Posts',
    icon: '📸',
    description: 'Aktualna usługa',
    badge: 'Aktywne',
  },
  {
    id: 'articles',
    name: 'Artykuły Blog',
    icon: '📝',
    description: 'Generuj artykuły SEO',
    comingSoon: true,
  },
  {
    id: 'scheduling',
    name: 'Planowanie Postów',
    icon: '📅',
    description: 'Zaplanuj publikacje',
    comingSoon: true,
  },
  {
    id: 'twitter',
    name: 'Posty na X (Twitter)',
    icon: '🐦',
    description: 'Tweety i wątki',
    comingSoon: true,
  },
  {
    id: 'facebook',
    name: 'Posty na Facebook',
    icon: '👥',
    description: 'Posty i historie FB',
    comingSoon: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok Content',
    icon: '🎵',
    description: 'Scenariusze do TikToka',
    comingSoon: true,
  },
];

export const ServicesSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Tab - Przyklejona do prawej krawędzi */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed right-0 top-1/2 -translate-y-1/2 z-40',
          'bg-gradient-to-b from-purple-600 via-pink-600 to-orange-500',
          'text-white font-bold py-6 px-3 rounded-l-xl shadow-2xl',
          'hover:px-4 transition-all duration-300',
          'flex items-center gap-2',
          'group',
          isOpen && 'hidden'
        )}
        aria-label="Otwórz menu usług"
      >
        <span className="writing-mode-vertical text-sm tracking-wider">
          INNE USŁUGI
        </span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Nasze Usługi</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Zamknij"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Kompleksowe narzędzia do content marketingu
          </p>
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {services.map((service) => (
            <button
              key={service.id}
              disabled={service.comingSoon}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                'hover:shadow-lg hover:scale-[1.02]',
                service.badge
                  ? 'border-purple-300 bg-purple-50'
                  : service.comingSoon
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-purple-300'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">{service.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {service.name}
                    </h3>
                    {service.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-purple-600 text-white rounded-full">
                        {service.badge}
                      </span>
                    )}
                    {service.comingSoon && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-400 text-white rounded-full">
                        Wkrótce
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>

                {/* Arrow */}
                {!service.comingSoon && (
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t bg-gray-50">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">
              Zainteresowany pełnym pakietem?
            </h3>
            <p className="text-sm text-gray-600">
              Dostęp do wszystkich narzędzi już wkrótce!
            </p>
          </div>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105">
            Dołącz do Listy Oczekujących
          </button>
        </div>
      </div>
    </>
  );
};
