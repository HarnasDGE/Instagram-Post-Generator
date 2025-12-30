/**
 * Application constants
 * Centralized configuration for easy updates and portability
 */

export const APP_CONFIG = {
  name: 'Instagram Post Generator',
  description: 'Generate engaging Instagram posts with AI',
  version: '1.0.0',
} as const;

export const FORM_LIMITS = {
  topic: {
    min: 3,
    max: 200,
  },
  profileDescription: {
    min: 10,
    max: 500,
  },
  examplePosts: {
    max: 2000,
  },
  avoidTopics: {
    max: 500,
  },
  numberOfImages: {
    min: 1,
    max: 10,
  },
} as const;

export const POST_STYLES = [
  { value: 'professional', label: 'Profesjonalny' },
  { value: 'casual', label: 'Casualowy' },
  { value: 'educational', label: 'Edukacyjny' },
  { value: 'motivational', label: 'Motywacyjny' },
  { value: 'humorous', label: 'Humorystyczny' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'promotional', label: 'Promocyjny' },
] as const;

export const LANGUAGES = [
  { value: 'pl', label: 'Polski', flag: '🇵🇱' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
] as const;

export const CTA_TYPES = [
  { value: 'none', label: 'Brak CTA' },
  { value: 'link_in_bio', label: 'Link w bio' },
  { value: 'comment', label: 'Zostaw komentarz' },
  { value: 'share', label: 'Udostępnij' },
  { value: 'save', label: 'Zapisz post' },
  { value: 'dm', label: 'Napisz na DM' },
  { value: 'tag_friend', label: 'Oznacz znajomego' },
  { value: 'visit_website', label: 'Odwiedź stronę' },
] as const;

/**
 * Cloudflare Turnstile configuration
 * Replace with your actual site key
 */
export const TURNSTILE_CONFIG = {
  siteKey: process.env.PUBLIC_TURNSTILE_SITE_KEY || 'YOUR_TURNSTILE_SITE_KEY',
  theme: 'light' as const,
} as const;

/**
 * API Configuration
 * Update these values when backend is ready
 */
export const API_CONFIG = {
  baseUrl: process.env.PUBLIC_API_URL || 'http://localhost:3000/api',
  endpoints: {
    generatePost: '/generate-post',
    validateToken: '/validate-token',
    getUserProfile: '/user/profile',
  },
  timeout: 30000, // 30 seconds
} as const;

/**
 * Mock mode for development
 */
export const USE_MOCK_API = import.meta.env.PUBLIC_USE_MOCK === 'true' || true;
