# 📸 Instagram Post Generator

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HarnasDGE/Instagram-Post-Generator)

Nowoczesna aplikacja do generowania postów na Instagram z wykorzystaniem AI, zbudowana w Astro + React.

## ✨ Funkcje

- 🎨 **7 stylów postów**: profesjonalny, casualowy, edukacyjny, motywacyjny, humorystyczny, storytelling, promocyjny
- 🌍 **Wsparcie dla 6 języków**: Polski, Angielski, Hiszpański, Niemiecki, Francuski, Włoski
- 📸 **Generowanie promptów do zdjęć**: otrzymuj propozycje dla AI image generators (Midjourney, DALL-E)
- #️⃣ **Smart hashtagi**: automatyczne generowanie relevantnych hashtagów
- 🎯 **Różne typy CTA**: link w bio, komentarze, udostępnienia, DM i więcej
- 🔒 **Bezpieczeństwo**: Cloudflare Turnstile (opcjonalne), walidacja formularzy z Zod
- 📱 **Responsywny design**: działa na wszystkich urządzeniach
- ⚡ **Szybki i nowoczesny**: Astro + React + Tailwind CSS

## 🚀 Szybki Start

### Wymagania

- Node.js 18.0 lub nowszy
- npm, yarn, lub pnpm

### Instalacja

```bash
# Klonuj repozytorium
git clone https://github.com/your-username/instagram-post-generator.git
cd instagram-post-generator

# Zainstaluj zależności
npm install

# Skopiuj plik .env.example
cp .env.example .env

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:4321`

**Gotowe!** Możesz już korzystać z aplikacji. Cloudflare Turnstile jest wyłączony domyślnie, więc nie musisz go konfigurować.

## 🔧 Konfiguracja

### Zmienne środowiskowe

Edytuj plik `.env`:

```env
# Cloudflare Turnstile (OPCJONALNE - domyślnie wyłączone)
PUBLIC_ENABLE_TURNSTILE=false
PUBLIC_TURNSTILE_SITE_KEY=

# Konfiguracja API
PUBLIC_API_URL=http://localhost:3000/api
PUBLIC_USE_MOCK=true  # Ustaw na false, gdy backend będzie gotowy

# Środowisko
NODE_ENV=development
```

### Cloudflare Turnstile (Opcjonalne)

**Turnstile jest WYŁĄCZONY domyślnie**, więc możesz używać aplikacji bez niego.

Aby włączyć Cloudflare Turnstile:

1. Przejdź do [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Wybierz "Turnstile" z menu
3. Utwórz nowy site
4. Skopiuj "Site Key" i "Secret Key"
5. Edytuj plik `.env`:
   ```env
   PUBLIC_ENABLE_TURNSTILE=true
   PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
   ```

## 🏗️ Struktura Projektu

```
/
├── public/              # Pliki statyczne
│   └── favicon.svg
├── src/
│   ├── components/      # Komponenty React
│   │   ├── ui/         # Komponenty UI (Button, Input, Card, etc.)
│   │   └── form/       # Komponenty formularza
│   ├── config/         # Konfiguracja aplikacji
│   ├── layouts/        # Layouty Astro
│   ├── lib/            # Utilities i logika
│   │   ├── api/       # API client i mock data
│   │   ├── utils.ts   # Helper functions
│   │   └── validation.ts # Zod schemas
│   ├── pages/          # Strony Astro
│   ├── styles/         # Style globalne
│   └── types/          # TypeScript types
├── astro.config.mjs    # Konfiguracja Astro
├── tailwind.config.mjs # Konfiguracja Tailwind
└── tsconfig.json       # Konfiguracja TypeScript
```

## 🔌 Integracja z Backendem

### Przygotowanie do produkcji

Gdy Twój backend (n8n) będzie gotowy:

1. **Wyłącz mock API**:
   ```env
   PUBLIC_USE_MOCK=false
   PUBLIC_API_URL=https://your-backend-url.com/api
   ```

2. **Dostosuj endpoint**:
   W pliku `src/config/constants.ts` zaktualizuj konfigurację API:
   ```typescript
   export const API_CONFIG = {
     baseUrl: process.env.PUBLIC_API_URL || 'https://your-backend-url.com/api',
     endpoints: {
       generatePost: '/generate-post',
       validateToken: '/validate-token',
       getUserProfile: '/user/profile',
     },
     timeout: 30000,
   } as const;
   ```

3. **Format żądania**:
   Backend powinien przyjmować POST request na endpoint `/generate-post`:
   ```typescript
   {
     topic: string;
     style: 'professional' | 'casual' | ...;
     language: 'pl' | 'en' | ...;
     profileDescription: string;
     examplePosts?: string;
     publishDate?: Date;
     avoidTopics?: string;
     numberOfImages: number;
     ctaType: 'none' | 'link_in_bio' | ...;
     captchaToken: string;
   }
   ```

4. **Format odpowiedzi**:
   Backend powinien zwracać:
   ```typescript
   {
     success: boolean;
     data?: {
       postText: string;
       hashtags: string[];
       imagePrompts: string[];
       estimatedEngagement?: number;
       suggestedPublishTime?: Date;
     };
     error?: {
       code: string;
       message: string;
       details?: any;
     };
   }
   ```

### Przykład integracji z n8n

W n8n stwórz workflow:

1. **Webhook Node**: Odbierz POST request
2. **Validate Turnstile Node**: Zweryfikuj captcha token
3. **AI Node** (np. OpenAI): Wygeneruj post na podstawie parametrów
4. **Response Node**: Zwróć wynik w formacie opisanym powyżej

## 📦 Build i Deploy

### Build do produkcji

```bash
npm run build
```

### Preview buildu

```bash
npm run preview
```

### Deploy

Aplikacja jest statyczna i może być wdrożona na:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- Dowolny hosting statyczny

#### Deploy na Vercel (ZALECANE)

**Najprostsza metoda - przez Dashboard:**

1. Push kod na GitHub
2. Przejdź do [vercel.com](https://vercel.com)
3. Kliknij **"Add New"** → **"Project"**
4. Import repozytorium **"Instagram-Post-Generator"**
5. Dodaj Environment Variables (opcjonalnie):
   ```
   PUBLIC_ENABLE_TURNSTILE=false
   PUBLIC_USE_MOCK=true
   ```
6. Kliknij **"Deploy"**

**Szczegółowa instrukcja:** Zobacz `VERCEL_DEPLOY.md`

#### Deploy na Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🧩 Reużywalność

Aplikacja została zaprojektowana z myślą o łatwej adaptacji do innych projektów:

### Komponenty UI

Wszystkie komponenty w `src/components/ui/` są w pełni reużywalne:
```typescript
import { Button, Input, Card } from '@components/ui';
```

### System typów

Typy TypeScript w `src/types/index.ts` można łatwo wyeksportować:
```typescript
import type { PostGenerationRequest, PostGenerationResponse } from '@types';
```

### Walidacja

Schematy Zod można wykorzystać w innych projektach:
```typescript
import { postGenerationSchema } from '@lib/validation';
```

### API Client

Klient API obsługuje zarówno mock, jak i rzeczywiste API:
```typescript
import { apiClient, APIClient } from '@lib/api/client';
```

## 🔐 Bezpieczeństwo

- ✅ Cloudflare Turnstile zapobiega botom i abuse
- ✅ Walidacja po stronie klienta (Zod)
- ✅ Walidacja po stronie serwera (zalecana w backend)
- ✅ Rate limiting (do implementacji w backend)
- ✅ Sanityzacja danych wejściowych

## 🎨 Customizacja

### Kolory

Edytuj `tailwind.config.mjs`:
```javascript
colors: {
  primary: {
    // Twoje kolory
  }
}
```

### Style postów

Dodaj nowy styl w `src/config/constants.ts`:
```typescript
export const POST_STYLES = [
  // ... istniejące
  { value: 'custom', label: 'Niestandardowy' },
];
```

### Mock dane

Dostosuj mock odpowiedzi w `src/lib/api/mock.ts`

## 📝 Licencja

MIT License - możesz swobodnie używać tego projektu w swoich aplikacjach.

## 🤝 Wsparcie

Jeśli masz pytania lub potrzebujesz pomocy:
- Otwórz Issue na GitHub
- Skontaktuj się przez email

## 🚧 Roadmap

- [ ] Obsługa kont użytkowników
- [ ] Integracja z płatnościami (Stripe)
- [ ] Historia wygenerowanych postów
- [ ] Edytor postów z podglądem
- [ ] Integracja z Instagram API
- [ ] Planowanie publikacji
- [ ] Analityka i statystyki

## 💡 Tips & Tricks

1. **Lepsze wyniki**: Im więcej szczegółów podasz w opisie profilu, tym lepszy będzie wygenerowany post
2. **Przykładowe posty**: Dodanie przykładowych postów pomaga AI zrozumieć Twój styl
3. **Testowanie**: Używaj trybu mock do testowania bez backendu
4. **Bezpieczeństwo**: Zawsze weryfikuj captcha token po stronie serwera

---

Stworzono z ❤️ używając Astro, React, i Tailwind CSS
