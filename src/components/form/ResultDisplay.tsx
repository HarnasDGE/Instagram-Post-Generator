import React from 'react';
import type { PostGenerationResponse } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

interface ResultDisplayProps {
  result: PostGenerationResponse;
  onGenerateAnother?: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onGenerateAnother }) => {
  if (!result.success || !result.data) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Błąd</CardTitle>
          <CardDescription className="text-red-600">
            {result.error?.message || 'Wystąpił nieznany błąd'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { postText, hashtags, imagePrompts, estimatedEngagement, suggestedPublishTime } = result.data;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Skopiowano do schowka!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Post Text */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Wygenerowany Post</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(postText)}
            >
              📋 Kopiuj
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-base leading-relaxed">{postText}</p>
          </div>
        </CardContent>
      </Card>

      {/* Hashtags */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hashtagi</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(hashtags.join(' '))}
            >
              📋 Kopiuj
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Propozycje zdjęć ({imagePrompts.length})</CardTitle>
          <CardDescription>
            Użyj tych promptów do wygenerowania zdjęć w AI (np. Midjourney, DALL-E)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {imagePrompts.map((prompt, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Zdjęcie {index + 1}
                    </p>
                    <p className="text-sm text-gray-600">{prompt}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(prompt)}
                  >
                    📋
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statystyki i sugestie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {estimatedEngagement && (
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Szacowane zaangażowanie</p>
                <p className="text-2xl font-bold text-primary-700">
                  {estimatedEngagement.toLocaleString()}
                </p>
              </div>
            )}
            {suggestedPublishTime && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Sugerowana publikacja</p>
                <p className="text-lg font-semibold text-blue-700">
                  {new Date(suggestedPublishTime).toLocaleDateString('pl-PL', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {onGenerateAnother && (
        <div className="flex justify-center">
          <Button onClick={onGenerateAnother} size="lg" variant="outline">
            ✨ Wygeneruj kolejny post
          </Button>
        </div>
      )}
    </div>
  );
};
