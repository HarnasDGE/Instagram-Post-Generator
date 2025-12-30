# 🚀 Deploy na Vercel - Instrukcja Krok Po Kroku

## Metoda 1: Deploy przez Vercel Dashboard (NAJŁATWIEJSZE)

### 1. Przygotuj GitHub

Upewnij się, że kod jest na GitHubie:
```bash
git push origin claude/instagram-generator-app-I5b2T
```

### 2. Import projektu do Vercel

1. Przejdź do: https://vercel.com
2. Zaloguj się przez GitHub
3. Kliknij **"Add New"** → **"Project"**
4. Znajdź repozytorium **"Instagram-Post-Generator"**
5. Kliknij **"Import"**

### 3. Konfiguracja projektu

Vercel automatycznie wykryje Astro. Upewnij się, że ustawienia są poprawne:

```
Framework Preset: Astro
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. Zmienne środowiskowe (Environment Variables)

W sekcji **"Environment Variables"** dodaj:

```
PUBLIC_ENABLE_TURNSTILE = false
PUBLIC_USE_MOCK = true
PUBLIC_API_URL = https://twoj-backend.com/api
NODE_ENV = production
```

**UWAGA:** Jeśli masz klucze Turnstile:
```
PUBLIC_ENABLE_TURNSTILE = true
PUBLIC_TURNSTILE_SITE_KEY = twój_site_key
```

### 5. Deploy!

1. Kliknij **"Deploy"**
2. Poczekaj ~2 minuty
3. Gotowe! 🎉

Vercel da Ci URL typu: `https://instagram-post-generator-xxx.vercel.app`

---

## Metoda 2: Deploy przez Vercel CLI

Jeśli masz dostęp do terminala:

```bash
# Zainstaluj Vercel CLI
npm install -g vercel

# Zaloguj się
vercel login

# Deploy
vercel

# Deploy do produkcji
vercel --prod
```

---

## 🔧 Konfiguracja po deploymencie

### Dodawanie własnej domeny

1. W Vercel Dashboard → Twój projekt
2. **Settings** → **Domains**
3. Dodaj swoją domenę
4. Skonfiguruj DNS zgodnie z instrukcjami Vercel

### Aktualizowanie zmiennych środowiskowych

1. Vercel Dashboard → Twój projekt
2. **Settings** → **Environment Variables**
3. Dodaj/edytuj zmienne
4. **Redeploy** projekt (Settings → Deployments → ... → Redeploy)

### Automatyczne deploymenty

Vercel automatycznie deployuje:
- **Production**: Każdy push do `main` brancha
- **Preview**: Każdy push do innych branchy

Możesz to zmienić w **Settings** → **Git**

---

## 📊 Monitoring

### Build Logs

Jeśli coś pójdzie nie tak:
1. Vercel Dashboard → Twój projekt
2. **Deployments** → Kliknij na deployment
3. Zobacz **Build Logs**

### Runtime Logs

1. Vercel Dashboard → Twój projekt
2. **Deployments** → Kliknij deployment
3. **Functions** → Zobacz logi

---

## ⚡ Optymalizacja

### Image Optimization

Vercel automatycznie optymalizuje obrazy. Jeśli dodasz zdjęcia w przyszłości, użyj:

```astro
---
import { Image } from 'astro:assets';
---
```

### Edge Functions (opcjonalnie)

Jeśli w przyszłości dodasz API routes w Astro, będą automatycznie deployowane jako Edge Functions.

---

## 🐛 Troubleshooting

### Problem: Build fails

**Rozwiązanie:**
1. Sprawdź Build Logs w Vercel
2. Upewnij się, że wszystkie dependencies są w `package.json`
3. Sprawdź czy TypeScript nie ma błędów

### Problem: Strona wyświetla 404

**Rozwiązanie:**
1. Sprawdź czy Output Directory = `dist`
2. Sprawdź czy Build Command = `npm run build`

### Problem: Environment variables nie działają

**Rozwiązanie:**
1. Zmienne MUSZĄ zaczynać się od `PUBLIC_` żeby były dostępne w przeglądarce
2. Po dodaniu zmiennych, **Redeploy** projekt
3. Sprawdź czy nie ma literówek w nazwach

### Problem: Turnstile nie działa

**Rozwiązanie:**
1. Upewnij się że `PUBLIC_ENABLE_TURNSTILE=true`
2. Sprawdź czy domena w Cloudflare Turnstile zawiera Twoją domenę Vercel
3. Dodaj zarówno:
   - `your-app.vercel.app`
   - `your-custom-domain.com` (jeśli masz)

---

## 🔒 Bezpieczeństwo

### Secrets w Vercel

NIGDY nie commituj:
- ❌ `.env` z prawdziwymi kluczami
- ❌ Turnstile Secret Key (to jest dla backendu!)
- ❌ API keys

Używaj Vercel Environment Variables:
- ✅ Dodaj je w Dashboard
- ✅ Różne dla Preview/Production
- ✅ Automatycznie wstrzykiwane podczas buildu

---

## 📱 Custom Domain + SSL

1. **Dodaj domenę w Vercel**
   - Settings → Domains → Add

2. **Skonfiguruj DNS** (u swojego dostawcy domeny):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate**
   - Vercel automatycznie generuje SSL (Let's Encrypt)
   - Gotowe w ~1 minutę

---

## 🎯 Checklist przed deploymentem

- [ ] Kod jest na GitHubie
- [ ] `.gitignore` zawiera `.env`
- [ ] Zmienne środowiskowe są dodane w Vercel
- [ ] Build działa lokalnie (`npm run build`)
- [ ] Preview działa lokalnie (`npm run preview`)
- [ ] Turnstile jest wyłączony LUB masz klucze
- [ ] Backend URL jest ustawiony (jeśli masz backend)

---

## 🚀 Po deploymencie

1. **Przetestuj aplikację:**
   - Wypełnij formularz
   - Sprawdź czy generuje posty (mock API)
   - Sprawdź responsywność

2. **Dodaj do README:**
   - Link do live demo
   - Screenshot aplikacji

3. **Share!**
   - Twitter/X
   - LinkedIn
   - Portfolio

---

**Gotowe!** Twoja aplikacja jest live na Vercel! 🎉

Przykładowy URL: `https://instagram-post-generator.vercel.app`
