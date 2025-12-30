/**
 * Core types for Instagram Post Generator
 * These types are designed to be portable and reusable across different projects
 */

export type PostStyle =
  | 'professional'
  | 'casual'
  | 'educational'
  | 'motivational'
  | 'humorous'
  | 'storytelling'
  | 'promotional';

export type PostLanguage =
  | 'pl'
  | 'en'
  | 'es'
  | 'de'
  | 'fr'
  | 'it';

export type CTAType =
  | 'none'
  | 'link_in_bio'
  | 'comment'
  | 'share'
  | 'save'
  | 'dm'
  | 'tag_friend'
  | 'visit_website';

export interface PostGenerationRequest {
  topic: string;
  style: PostStyle;
  language: PostLanguage;
  profileDescription: string;
  examplePosts?: string;
  publishDate?: Date;
  avoidTopics?: string;
  numberOfImages: number;
  ctaType: CTAType;
  captchaToken: string;
}

export interface PostGenerationResponse {
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
    details?: Record<string, unknown>;
  };
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface APIError {
  statusCode: number;
  message: string;
  errors?: FormFieldError[];
}

/**
 * Configuration interface for easy backend integration
 */
export interface APIConfig {
  baseUrl: string;
  endpoints: {
    generatePost: string;
    validateToken?: string;
    getUserProfile?: string;
  };
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * User account interface (for future implementation)
 */
export interface UserAccount {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'basic' | 'premium';
  creditsRemaining: number;
  createdAt: Date;
}
