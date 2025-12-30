import React, { useState } from 'react';
import { PostGeneratorForm } from './form/PostGeneratorForm';
import { ResultDisplay } from './form/ResultDisplay';
import type { PostGenerationResponse } from '@/types';

export default function App() {
  const [result, setResult] = useState<PostGenerationResponse | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSuccess = (response: PostGenerationResponse) => {
    setResult(response);
    setShowForm(false);
  };

  const handleGenerateAnother = () => {
    setResult(null);
    setShowForm(true);
  };

  return (
    <div className="w-full">
      {showForm ? (
        <PostGeneratorForm onSuccess={handleSuccess} />
      ) : result ? (
        <ResultDisplay result={result} onGenerateAnother={handleGenerateAnother} />
      ) : null}
    </div>
  );
}
