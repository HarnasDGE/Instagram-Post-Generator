import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postGenerationSchema, type PostGenerationFormData } from '@/lib/validation';
import { apiClient } from '@/lib/api/client';
import { POST_STYLES, LANGUAGES, CTA_TYPES, TURNSTILE_CONFIG } from '@/config/constants';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Label } from '@components/ui/Label';
import { Textarea } from '@components/ui/Textarea';
import { Select } from '@components/ui/Select';
import { FormField } from '@components/ui/FormField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { TurnstileWidget } from './TurnstileWidget';
import type { PostGenerationResponse } from '@/types';

interface PostGeneratorFormProps {
  onSuccess?: (response: PostGenerationResponse) => void;
}

export const PostGeneratorForm: React.FC<PostGeneratorFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(TURNSTILE_CONFIG.enabled ? '' : 'disabled');
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PostGenerationFormData>({
    resolver: zodResolver(postGenerationSchema),
    defaultValues: {
      style: 'professional',
      language: 'pl',
      numberOfImages: 1,
      ctaType: 'none',
    },
  });

  const onSubmit = async (data: PostGenerationFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await apiClient.generatePost({
        topic: data.topic,
        style: data.style,
        language: data.language,
        profileDescription: data.profileDescription,
        examplePosts: data.examplePosts,
        publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
        avoidTopics: data.avoidTopics,
        numberOfImages: data.numberOfImages,
        ctaType: data.ctaType,
        captchaToken: data.captchaToken || 'disabled',
      });

      if (response.success) {
        onSuccess?.(response);
        // Optionally reset form
        // reset();
        // setCaptchaToken('');
      } else {
        setApiError(response.error?.message || 'Wystąpił błąd podczas generowania posta');
      }
    } catch (error) {
      setApiError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaSuccess = (token: string) => {
    setCaptchaToken(token);
    setValue('captchaToken', token);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="instagram-gradient bg-clip-text text-transparent">
          Generator Postów Instagram
        </CardTitle>
        <CardDescription>
          Wypełnij formularz, aby wygenerować angażujący post na Instagram
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Topic */}
          <FormField error={errors.topic?.message}>
            <Label htmlFor="topic" required>
              Temat posta
            </Label>
            <Input
              id="topic"
              placeholder="np. Produktywność w pracy zdalnej"
              error={errors.topic?.message}
              {...register('topic')}
            />
          </FormField>

          {/* Style and Language Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={errors.style?.message}>
              <Label htmlFor="style" required>
                Styl posta
              </Label>
              <Select id="style" error={errors.style?.message} {...register('style')}>
                {POST_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField error={errors.language?.message}>
              <Label htmlFor="language" required>
                Język
              </Label>
              <Select id="language" error={errors.language?.message} {...register('language')}>
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          {/* Profile Description */}
          <FormField error={errors.profileDescription?.message}>
            <Label htmlFor="profileDescription" required>
              Opis profilu
            </Label>
            <Textarea
              id="profileDescription"
              placeholder="Opisz swój profil Instagram: tematyka, grupa docelowa, ton komunikacji..."
              error={errors.profileDescription?.message}
              rows={3}
              {...register('profileDescription')}
            />
          </FormField>

          {/* Example Posts (Optional) */}
          <FormField error={errors.examplePosts?.message}>
            <Label htmlFor="examplePosts">
              Przykładowe posty (opcjonalne)
            </Label>
            <Textarea
              id="examplePosts"
              placeholder="Wklej przykładowe posty, które Ci się podobają..."
              error={errors.examplePosts?.message}
              rows={4}
              {...register('examplePosts')}
            />
          </FormField>

          {/* Publish Date and Number of Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField error={errors.publishDate?.message}>
              <Label htmlFor="publishDate">
                Data publikacji (opcjonalne)
              </Label>
              <Input
                id="publishDate"
                type="datetime-local"
                error={errors.publishDate?.message}
                {...register('publishDate')}
              />
            </FormField>

            <FormField error={errors.numberOfImages?.message}>
              <Label htmlFor="numberOfImages" required>
                Ilość zdjęć
              </Label>
              <Input
                id="numberOfImages"
                type="number"
                min="1"
                max="10"
                error={errors.numberOfImages?.message}
                {...register('numberOfImages', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          {/* Avoid Topics */}
          <FormField error={errors.avoidTopics?.message}>
            <Label htmlFor="avoidTopics">
              Czego unikać (opcjonalne)
            </Label>
            <Textarea
              id="avoidTopics"
              placeholder="Tematy lub słowa, których chcesz uniknąć w poście..."
              error={errors.avoidTopics?.message}
              rows={2}
              {...register('avoidTopics')}
            />
          </FormField>

          {/* CTA Type */}
          <FormField error={errors.ctaType?.message}>
            <Label htmlFor="ctaType" required>
              Typ Call-to-Action
            </Label>
            <Select id="ctaType" error={errors.ctaType?.message} {...register('ctaType')}>
              {CTA_TYPES.map((cta) => (
                <option key={cta.value} value={cta.value}>
                  {cta.label}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Captcha - only show if enabled */}
          {TURNSTILE_CONFIG.enabled && (
            <FormField error={errors.captchaToken?.message}>
              <Label required>Weryfikacja</Label>
              <TurnstileWidget onSuccess={handleCaptchaSuccess} />
            </FormField>
          )}

          {/* API Error */}
          {apiError && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium">{apiError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={TURNSTILE_CONFIG.enabled && !captchaToken}
          >
            {isSubmitting ? 'Generuję post...' : 'Wygeneruj post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
