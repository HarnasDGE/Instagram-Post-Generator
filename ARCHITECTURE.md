# 🏗️ Architektura Aplikacji

## Przegląd

Instagram Post Generator to aplikacja typu JAMstack zbudowana w Astro z komponentami React. Architektura została zaprojektowana z myślą o:

- **Modularności** - łatwe dodawanie nowych funkcji
- **Reużywalności** - komponenty można używać w innych projektach
- **Skalowalności** - gotowa na wzrost liczby użytkowników
- **Bezpieczeństwie** - wielowarstwowe zabezpieczenia
- **Wydajności** - optymalizacja dla szybkiego ładowania

## 📊 Diagram Architektury

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Astro Static Site (SSG)                  │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │         React Components (Islands)           │ │    │
│  │  │                                              │ │    │
│  │  │  ├─ PostGeneratorForm                       │ │    │
│  │  │  ├─ TurnstileWidget                         │ │    │
│  │  │  ├─ ResultDisplay                           │ │    │
│  │  │  └─ UI Components (Button, Input, etc.)     │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────────────┐ │    │
│  │  │         Client-side Logic                    │ │    │
│  │  │                                              │ │    │
│  │  │  ├─ Form Validation (Zod)                   │ │    │
│  │  │  ├─ State Management (React Hooks)          │ │    │
│  │  │  └─ API Client                              │ │    │
│  │  └──────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            │ HTTPS                           │
│                            ▼                                 │
└─────────────────────────────────────────────────────────────┘
                             │
                             │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌────────────────┐  ┌──────────────┐
│   Cloudflare  │  │   Your API     │  │  AI Service  │
│   Turnstile   │  │   (n8n/Node)   │  │  (OpenAI)    │
└───────────────┘  └────────────────┘  └──────────────┘
```

## 🗂️ Struktura Folderów

```
src/
├── components/          # React komponenty
│   ├── ui/             # Reużywalne komponenty UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── form/           # Komponenty specyficzne dla formularza
│   │   ├── PostGeneratorForm.tsx
│   │   ├── TurnstileWidget.tsx
│   │   └── ResultDisplay.tsx
│   └── App.tsx         # Main application component
│
├── config/             # Konfiguracja aplikacji
│   └── constants.ts    # Stałe i konfiguracja
│
├── layouts/            # Astro layouts
│   └── BaseLayout.astro
│
├── lib/                # Logika biznesowa i utilities
│   ├── api/           # API communication
│   │   ├── client.ts  # API client
│   │   └── mock.ts    # Mock data dla development
│   ├── utils.ts       # Helper functions
│   └── validation.ts  # Zod schemas
│
├── pages/              # Astro pages (routing)
│   └── index.astro
│
├── styles/             # Global styles
│   └── global.css
│
└── types/              # TypeScript definitions
    └── index.ts
```

## 🔄 Data Flow

### 1. Form Submission Flow

```
User Input
    │
    ▼
PostGeneratorForm
    │
    ├─ React Hook Form (form state)
    ├─ Zod Validation (client-side)
    └─ TurnstileWidget (captcha)
    │
    ▼
API Client
    │
    ├─ Mock API (development)
    └─ Real API (production)
    │
    ▼
Backend (n8n/Node)
    │
    ├─ Verify Turnstile
    ├─ Validate Input
    ├─ Rate Limiting
    └─ Call AI Service
    │
    ▼
Response
    │
    ├─ Success → ResultDisplay
    └─ Error → Error Message
```

### 2. Component Communication

```
App.tsx (State Container)
    │
    ├─ showForm: boolean
    ├─ result: PostGenerationResponse | null
    │
    ├─ PostGeneratorForm
    │   │
    │   ├─ onSuccess(response) → Update App state
    │   └─ Form Fields
    │       ├─ Input (controlled)
    │       ├─ Select (controlled)
    │       ├─ Textarea (controlled)
    │       └─ TurnstileWidget
    │
    └─ ResultDisplay
        │
        ├─ Display generated post
        ├─ Display hashtags
        ├─ Display image prompts
        └─ onGenerateAnother() → Reset App state
```

## 🔐 Security Layers

### Layer 1: Client-side Validation
- Zod schema validation
- Input sanitization
- Type checking (TypeScript)

### Layer 2: Captcha
- Cloudflare Turnstile
- Bot prevention
- Abuse prevention

### Layer 3: Server-side Validation
- Backend validates all inputs
- Turnstile token verification
- Rate limiting

### Layer 4: API Security
- CORS configuration
- HTTPS only
- API key authentication (optional)

## 🎨 Styling Architecture

### Tailwind CSS + CSS Variables

```
tailwind.config.mjs
    │
    ├─ Theme customization
    ├─ Color palette
    └─ Animations
    │
    ▼
global.css
    │
    ├─ CSS Variables (light/dark theme)
    ├─ Base styles
    └─ Utility classes
    │
    ▼
Components
    │
    └─ className with Tailwind utilities
```

### Design System

```
Colors:
├─ primary: Purple gradient (Instagram-like)
├─ secondary: Gray scale
├─ success: Green
├─ error: Red
└─ info: Blue

Typography:
├─ Font: Inter (Google Fonts)
├─ Sizes: text-sm, text-base, text-lg, text-xl, text-2xl
└─ Weights: 400, 500, 600, 700

Spacing:
└─ Tailwind default scale (4px base)

Border Radius:
├─ rounded-lg (0.5rem) - inputs, buttons
└─ rounded-xl (0.75rem) - cards
```

## 🚀 Performance Optimizations

### 1. Astro Islands Architecture
- Tylko interaktywne komponenty to React
- Reszta to statyczny HTML
- Lazy loading komponentów

### 2. Code Splitting
- Automatyczne przez Astro/Vite
- Dynamic imports dla heavy komponentów

### 3. Asset Optimization
- SVG favicon (scalable, małe)
- No external images
- Google Fonts with preconnect

### 4. API Optimization
- Request timeout (30s)
- AbortController support
- Error retry logic (opcjonalnie)

## 📦 State Management

### Minimalistyczne podejście

```typescript
// App-level state
const [result, setResult] = useState<Response | null>(null);
const [showForm, setShowForm] = useState(true);

// Form-level state
const { register, handleSubmit, formState } = useForm();

// Component-level state
const [isLoading, setIsLoading] = useState(false);
const [captchaToken, setCaptchaToken] = useState('');
```

**Dlaczego nie Redux/Zustand?**
- Aplikacja jest prosta
- State jest lokalny
- Mniej boilerplate
- Łatwiejsze do przeniesienia

Jeśli aplikacja urośnie:
1. Dodaj Context API dla shared state
2. Lub Zustand dla globalnego store

## 🔌 API Integration Pattern

### Adapter Pattern

```typescript
// API Client - Adapter między app a backend
class APIClient {
  private config: APIConfig;

  async generatePost(request) {
    if (USE_MOCK) {
      return mockAPI.generatePost(request);
    }
    return realAPI.generatePost(request);
  }
}

// Łatwa zamiana mock ↔ real
export const apiClient = new APIClient(API_CONFIG);
```

**Zalety:**
- Jednolity interface
- Łatwe testowanie
- Łatwa migracja do produkcji
- Możliwość A/B testing

## 🧪 Testing Strategy

### Poziomy testowania

```
1. Type Safety (TypeScript)
   └─ Compile-time errors

2. Validation (Zod)
   └─ Runtime validation

3. Unit Tests (opcjonalnie)
   ├─ Test utilities
   ├─ Test validation schemas
   └─ Test API client

4. Integration Tests (opcjonalnie)
   ├─ Test form submission
   └─ Test API integration

5. E2E Tests (opcjonalnie)
   └─ Playwright/Cypress
```

## 🔄 Build Process

```
Source Code (src/)
    │
    ▼
TypeScript Compilation
    │
    ▼
Astro Build
    ├─ Static HTML generation
    ├─ CSS bundling (Tailwind)
    ├─ JS bundling (Vite)
    └─ Asset optimization
    │
    ▼
Output (dist/)
    │
    └─ Ready for deployment
```

## 📱 Responsive Design

### Breakpoints (Tailwind default)

```
sm:  640px  - Mobile landscape
md:  768px  - Tablet
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

### Mobile-First Approach

```tsx
// Default: Mobile
<div className="grid grid-cols-1">

// md+: Tablet and up
<div className="grid grid-cols-1 md:grid-cols-2">

// lg+: Desktop and up
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## 🌐 Internationalization (Future)

Przygotowanie do i18n:

```
src/
├── locales/
│   ├── pl.json
│   ├── en.json
│   └── ...
└── lib/
    └── i18n.ts
```

## 🔮 Scalability Considerations

### Gdy aplikacja urośnie:

1. **User Authentication**
   ```
   src/
   └── features/
       ├── auth/
       │   ├── Login.tsx
       │   ├── Register.tsx
       │   └── authService.ts
       └── posts/
           └── ...
   ```

2. **Database Integration**
   ```
   ├─ Save generated posts
   ├─ User history
   └─ Analytics
   ```

3. **Payment Integration**
   ```
   src/
   └── features/
       └── billing/
           ├── Checkout.tsx
           └── stripeService.ts
   ```

4. **Admin Panel**
   ```
   src/
   └── pages/
       └── admin/
           ├── dashboard.astro
           └── users.astro
   ```

---

**Kluczowe Zasady Architektury:**

1. ✅ **Separation of Concerns** - każdy moduł ma jasno określoną rolę
2. ✅ **DRY (Don't Repeat Yourself)** - reużywalne komponenty
3. ✅ **SOLID Principles** - szczególnie Single Responsibility
4. ✅ **Type Safety** - TypeScript everywhere
5. ✅ **Progressive Enhancement** - działa bez JS, lepiej z JS
6. ✅ **Performance First** - Astro Islands, lazy loading
7. ✅ **Security by Design** - wielowarstwowe zabezpieczenia
