import type { PostGenerationRequest, PostGenerationResponse } from '@/types';
import { delay } from '@/lib/utils';

/**
 * Mock API service for development
 * Replace this with actual API calls when backend is ready
 */

const MOCK_RESPONSES = {
  professional: {
    postText: `🎯 Profesjonalny rozwój to nie sprint, to maraton.

W dzisiejszym świecie biznesu kluczem do sukcesu jest ciągłe doskonalenie swoich umiejętności. Pamiętaj:

✅ Inwestuj w siebie codziennie
✅ Ucz się od najlepszych
✅ Wychodź poza strefę komfortu
✅ Buduj wartościowe relacje

Każdy dzień to nowa szansa na rozwój. Co dziś zrobiłeś dla swojego rozwoju?`,
    hashtags: ['#rozwojprofesjonalny', '#biznes', '#sukces', '#motywacja', '#edukacja'],
    imagePrompts: [
      'Professional business environment, modern office, person working on laptop',
      'Inspirational quote about professional development on minimalist background',
    ],
  },
  casual: {
    postText: `Hej! 👋

Dzisiaj chciałem się z Wami podzielić czymś ważnym...

Czasami warto zwolnić i docenić małe rzeczy. ☕️

Te momenty, kiedy siedzisz z kawą, patrzysz przez okno i po prostu... jesteś. To właśnie wtedy przychodzą najlepsze pomysły!

A Wy jak spędzacie swoje chwile relaksu?`,
    hashtags: ['#życie', '#relaks', '#mindfulness', '#codzienność', '#chwila'],
    imagePrompts: [
      'Person enjoying coffee by the window, relaxed atmosphere, natural light',
      'Cozy moment, lifestyle photography, candid shot',
    ],
  },
  educational: {
    postText: `📚 Czy wiesz, że...?

5 faktów o produktywności, które zmienią Twoje podejście do pracy:

1️⃣ Zasada 2 minut: Jeśli coś zajmie mniej niż 2 minuty - zrób to od razu
2️⃣ Pomodoro: 25 min pracy + 5 min przerwy = maksymalna koncentracja
3️⃣ Batching: Grupuj podobne zadania razem
4️⃣ Eat the Frog: Najtrudniejsze zadanie rób rano
5️⃣ Digital detox: Wyłącz powiadomienia podczas głębokiej pracy

Który tip wypróbujesz jutro? 💡`,
    hashtags: ['#produktywność', '#edukacja', '#tips', '#nauka', '#rozwój'],
    imagePrompts: [
      'Educational infographic about productivity, clean design, modern style',
      'Person studying or working productively, focused environment',
    ],
  },
};

export async function generatePost(request: PostGenerationRequest): Promise<PostGenerationResponse> {
  // Simulate network delay
  await delay(2000);

  // Simulate random errors (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: 'Wystąpił błąd podczas generowania posta. Spróbuj ponownie.',
      },
    };
  }

  // Get mock response based on style
  const mockData = MOCK_RESPONSES[request.style as keyof typeof MOCK_RESPONSES] || MOCK_RESPONSES.professional;

  // Adjust number of image prompts
  const imagePrompts = mockData.imagePrompts.slice(0, request.numberOfImages);

  return {
    success: true,
    data: {
      postText: mockData.postText,
      hashtags: mockData.hashtags,
      imagePrompts,
      estimatedEngagement: Math.floor(Math.random() * 5000) + 500,
      suggestedPublishTime: request.publishDate || new Date(Date.now() + 86400000), // Tomorrow
    },
  };
}

/**
 * Validate captcha token (mock)
 */
export async function validateCaptcha(token: string): Promise<boolean> {
  await delay(500);
  // Mock validation - always returns true for development
  return token.length > 0;
}
