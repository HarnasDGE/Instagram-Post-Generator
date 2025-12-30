import { z } from 'zod';
import { FORM_LIMITS } from '@/config/constants';

/**
 * Zod schema for post generation form
 * This schema can be easily reused across different projects
 */
export const postGenerationSchema = z.object({
  topic: z
    .string()
    .min(FORM_LIMITS.topic.min, `Temat musi mieć co najmniej ${FORM_LIMITS.topic.min} znaki`)
    .max(FORM_LIMITS.topic.max, `Temat może mieć maksymalnie ${FORM_LIMITS.topic.max} znaków`),

  style: z.enum([
    'professional',
    'casual',
    'educational',
    'motivational',
    'humorous',
    'storytelling',
    'promotional',
  ], {
    errorMap: () => ({ message: 'Wybierz styl posta' }),
  }),

  language: z.enum(['pl', 'en', 'es', 'de', 'fr', 'it'], {
    errorMap: () => ({ message: 'Wybierz język' }),
  }),

  profileDescription: z
    .string()
    .min(FORM_LIMITS.profileDescription.min, `Opis profilu musi mieć co najmniej ${FORM_LIMITS.profileDescription.min} znaków`)
    .max(FORM_LIMITS.profileDescription.max, `Opis profilu może mieć maksymalnie ${FORM_LIMITS.profileDescription.max} znaków`),

  examplePosts: z
    .string()
    .max(FORM_LIMITS.examplePosts.max, `Przykładowe posty mogą mieć maksymalnie ${FORM_LIMITS.examplePosts.max} znaków`)
    .optional(),

  publishDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const now = new Date();
        return selectedDate >= now;
      },
      { message: 'Data publikacji nie może być w przeszłości' }
    ),

  avoidTopics: z
    .string()
    .max(FORM_LIMITS.avoidTopics.max, `Pole może mieć maksymalnie ${FORM_LIMITS.avoidTopics.max} znaków`)
    .optional(),

  numberOfImages: z
    .number()
    .min(FORM_LIMITS.numberOfImages.min, `Minimum ${FORM_LIMITS.numberOfImages.min} zdjęcie`)
    .max(FORM_LIMITS.numberOfImages.max, `Maksimum ${FORM_LIMITS.numberOfImages.max} zdjęć`)
    .int('Liczba zdjęć musi być liczbą całkowitą'),

  ctaType: z.enum([
    'none',
    'link_in_bio',
    'comment',
    'share',
    'save',
    'dm',
    'tag_friend',
    'visit_website',
  ], {
    errorMap: () => ({ message: 'Wybierz typ CTA' }),
  }),

  captchaToken: z
    .string()
    .min(1, 'Wypełnij captcha'),
});

export type PostGenerationFormData = z.infer<typeof postGenerationSchema>;
