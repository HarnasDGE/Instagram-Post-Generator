import type { PostGenerationRequest, PostGenerationResponse, APIConfig } from '@/types';
import { API_CONFIG, USE_MOCK_API } from '@/config/constants';
import { generatePost as mockGeneratePost } from './mock';

/**
 * API Client for backend communication
 * Supports both mock and real API endpoints
 */
class APIClient {
  private config: APIConfig;

  constructor(config: APIConfig) {
    this.config = config;
  }

  /**
   * Generate Instagram post
   */
  async generatePost(request: PostGenerationRequest): Promise<PostGenerationResponse> {
    // Use mock API if enabled
    if (USE_MOCK_API) {
      return mockGeneratePost(request);
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.generatePost}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.config.timeout || 30000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: errorData.message || 'Wystąpił błąd podczas komunikacji z serwerem',
            details: errorData,
          },
        };
      }

      const data: PostGenerationResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error.name === 'AbortError'
              ? 'Przekroczono limit czasu żądania'
              : 'Błąd połączenia z serwerem',
            details: { originalError: error.message },
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'Wystąpił nieznany błąd',
        },
      };
    }
  }

  /**
   * Update API configuration
   */
  updateConfig(config: Partial<APIConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const apiClient = new APIClient(API_CONFIG);

// Export for easy backend integration
export { APIClient };
