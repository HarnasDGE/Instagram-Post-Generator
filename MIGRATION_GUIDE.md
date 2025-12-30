# 🔄 Przewodnik Migracji do Produkcji

Ten dokument pomoże Ci przejść z trybu deweloperskiego (mock API) do produkcji z rzeczywistym backendem.

## 📋 Checklist przed migracją

- [ ] Backend API jest gotowy i działa
- [ ] Endpoint do generowania postów jest dostępny
- [ ] Cloudflare Turnstile jest skonfigurowany
- [ ] Zmienne środowiskowe są ustawione
- [ ] Testy integracyjne zostały przeprowadzone
- [ ] Rate limiting jest włączony na backendzie
- [ ] CORS jest poprawnie skonfigurowany

## 🔧 Krok po kroku

### 1. Przygotuj Backend

Twój backend (n8n lub inny) musi obsługiwać endpoint:

**Endpoint**: `POST /api/generate-post`

**Request Body**:
```json
{
  "topic": "Produktywność w pracy zdalnej",
  "style": "professional",
  "language": "pl",
  "profileDescription": "Profil dla freelancerów...",
  "examplePosts": "Optional",
  "publishDate": "2025-01-15T10:00:00Z",
  "avoidTopics": "polityka, religia",
  "numberOfImages": 2,
  "ctaType": "link_in_bio",
  "captchaToken": "token_from_turnstile"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "postText": "Wygenerowany tekst posta...",
    "hashtags": ["#produktywność", "#praca"],
    "imagePrompts": [
      "Professional workspace with laptop",
      "Person working remotely"
    ],
    "estimatedEngagement": 2500,
    "suggestedPublishTime": "2025-01-15T14:00:00Z"
  }
}
```

**Response Error (400/500)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "topic",
      "issue": "too short"
    }
  }
}
```

### 2. Konfiguracja Cloudflare Turnstile (OPCJONALNIE)

**UWAGA:** Turnstile jest domyślnie WYŁĄCZONY. Możesz pominąć ten krok, jeśli nie chcesz używać captcha.

#### Włączenie Turnstile

Jeśli chcesz włączyć Cloudflare Turnstile:

1. Edytuj `.env.production`:
   ```env
   PUBLIC_ENABLE_TURNSTILE=true
   PUBLIC_TURNSTILE_SITE_KEY=your_production_site_key
   ```

#### Weryfikacja po stronie serwera (jeśli używasz Turnstile)

Backend POWINIEN weryfikować token Turnstile:

```javascript
// Przykład dla Node.js
async function verifyTurnstile(token) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const data = await response.json();
  return data.success;
}

// W endpoint handler
// Tylko jeśli Turnstile jest włączony
if (captchaToken && captchaToken !== 'disabled') {
  if (!await verifyTurnstile(captchaToken)) {
    return {
      success: false,
      error: {
        code: 'CAPTCHA_FAILED',
        message: 'Invalid captcha token'
      }
    };
  }
}
```

### 3. Aktualizuj Zmienne Środowiskowe

Stwórz plik `.env.production`:

```env
# Cloudflare Turnstile
PUBLIC_TURNSTILE_SITE_KEY=your_production_site_key

# API Configuration
PUBLIC_API_URL=https://your-backend.com/api
PUBLIC_USE_MOCK=false

# Environment
NODE_ENV=production
```

### 4. Zaktualizuj Konfigurację API (opcjonalnie)

Jeśli Twój backend wymaga dodatkowych headers lub autentykacji:

`src/config/constants.ts`:
```typescript
export const API_CONFIG = {
  baseUrl: process.env.PUBLIC_API_URL || 'https://your-backend.com/api',
  endpoints: {
    generatePost: '/generate-post',
    validateToken: '/validate-token',
    getUserProfile: '/user/profile',
  },
  headers: {
    'Content-Type': 'application/json',
    // Dodaj dodatkowe headers jeśli potrzebne
    // 'Authorization': 'Bearer token',
    // 'X-API-Key': 'your-api-key',
  },
  timeout: 30000,
} as const;
```

### 5. Testowanie

#### Lokalnie z prawdziwym API

```bash
# W .env
PUBLIC_USE_MOCK=false
PUBLIC_API_URL=http://localhost:3000/api  # Twój lokalny backend

npm run dev
```

#### Testy do przeprowadzenia

1. ✅ Wysłanie poprawnego formularza
2. ✅ Walidacja błędnych danych
3. ✅ Timeout handling
4. ✅ Network error handling
5. ✅ Captcha verification
6. ✅ Rate limiting
7. ✅ Response time (< 30s)

### 6. Deploy Frontend

```bash
# Build
npm run build

# Test build lokalnie
npm run preview

# Deploy (przykład Vercel)
vercel --prod
```

### 7. Konfiguracja CORS na Backendzie

Twój backend musi akceptować requesty z Twojej domeny:

```javascript
// Przykład dla Express.js
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  methods: ['POST', 'GET'],
  credentials: true
}));
```

## 🔐 Bezpieczeństwo w Produkcji

### Rate Limiting

Zaimplementuj rate limiting na backendzie:

```javascript
// Przykład: 10 requestów na IP na godzinę
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});

app.use('/api/generate-post', limiter);
```

### Walidacja po stronie serwera

ZAWSZE waliduj dane wejściowe:

```javascript
const Joi = require('joi');

const schema = Joi.object({
  topic: Joi.string().min(3).max(200).required(),
  style: Joi.string().valid('professional', 'casual', ...).required(),
  language: Joi.string().valid('pl', 'en', ...).required(),
  // ... rest of validation
});

const { error, value } = schema.validate(req.body);
if (error) {
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: error.details[0].message
    }
  });
}
```

### Sanityzacja

Sanityzuj wszystkie dane wejściowe:

```javascript
const sanitize = require('sanitize-html');

const cleanTopic = sanitize(req.body.topic, {
  allowedTags: [],
  allowedAttributes: {}
});
```

## 🚀 Optymalizacja

### Cache Responses (opcjonalnie)

Jeśli generujesz podobne posty:

```javascript
const cache = new Map();

function getCacheKey(request) {
  return JSON.stringify({
    topic: request.topic,
    style: request.style,
    language: request.language
  });
}

const cacheKey = getCacheKey(req.body);
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}

// Generate new...
cache.set(cacheKey, result);
```

### Monitoring

Dodaj monitoring i logging:

```javascript
// Log każdy request
console.log({
  timestamp: new Date(),
  endpoint: '/generate-post',
  ip: req.ip,
  userAgent: req.get('user-agent'),
  data: {
    topic: req.body.topic,
    style: req.body.style
  }
});

// Monitor errors
if (error) {
  console.error({
    timestamp: new Date(),
    error: error.message,
    stack: error.stack,
    request: req.body
  });
}
```

## 🔄 Przykład n8n Workflow

1. **HTTP Request Node** (Webhook)
   - Method: POST
   - Path: /generate-post

2. **Cloudflare Turnstile Node** (Function)
   ```javascript
   const token = $input.item.json.body.captchaToken;
   const secret = $env.TURNSTILE_SECRET;

   const response = await fetch(
     'https://challenges.cloudflare.com/turnstile/v0/siteverify',
     {
       method: 'POST',
       body: JSON.stringify({ secret, response: token }),
       headers: { 'Content-Type': 'application/json' }
     }
   );

   const result = await response.json();
   if (!result.success) {
     throw new Error('Captcha verification failed');
   }

   return $input.item;
   ```

3. **Validate Input Node** (Function)
   ```javascript
   const { topic, style, language } = $input.item.json.body;

   if (!topic || topic.length < 3) {
     throw new Error('Topic too short');
   }

   // More validation...
   return $input.item;
   ```

4. **OpenAI Node** or **HTTP Request to AI**
   - Prompt: Build from input data
   - Model: GPT-4 or similar

5. **Format Response Node** (Function)
   ```javascript
   const aiResponse = $input.item.json.choices[0].message.content;

   return {
     success: true,
     data: {
       postText: aiResponse,
       hashtags: extractHashtags(aiResponse),
       imagePrompts: generateImagePrompts($input.item.json.body),
       estimatedEngagement: Math.random() * 5000,
       suggestedPublishTime: new Date()
     }
   };
   ```

6. **Respond to Webhook Node**
   - Response Code: 200
   - Response Body: {{ $json }}

## 📊 Monitoring w Produkcji

### Metryki do śledzenia

1. Request count (ile requestów)
2. Success rate (% udanych generacji)
3. Average response time
4. Error rate i typy błędów
5. Captcha rejection rate
6. User retention

### Przykład Dashboard

```
┌─────────────────────────────────────┐
│ Instagram Post Generator Stats     │
├─────────────────────────────────────┤
│ Requests today: 1,234              │
│ Success rate: 94.2%                │
│ Avg response time: 2.3s            │
│ Errors: 5.8%                       │
│   - Captcha failed: 2.1%          │
│   - Validation: 1.8%               │
│   - AI errors: 1.9%                │
└─────────────────────────────────────┘
```

## 🆘 Troubleshooting

### Problem: CORS errors

**Rozwiązanie**: Sprawdź konfigurację CORS na backendzie

### Problem: Timeout errors

**Rozwiązanie**: Zwiększ timeout w `API_CONFIG.timeout` lub optymalizuj backend

### Problem: Captcha zawsze failuje

**Rozwiązanie**:
- Sprawdź czy używasz prawidłowego Secret Key na backendzie
- Upewnij się, że Site Key w .env jest prawidłowy
- Sprawdź czy domena jest dodana w Cloudflare Turnstile

### Problem: Network errors

**Rozwiązanie**: Sprawdź czy `PUBLIC_API_URL` jest prawidłowy i dostępny

## ✅ Post-Migration Checklist

- [ ] Frontend deployowany i działa
- [ ] Backend deployowany i działa
- [ ] Captcha działa poprawnie
- [ ] Wszystkie endpointy odpowiadają
- [ ] Monitoring jest skonfigurowany
- [ ] Backup plan jest gotowy
- [ ] Rate limiting działa
- [ ] HTTPS jest włączony
- [ ] Testy end-to-end przeszły

---

Powodzenia z migracją! 🚀
