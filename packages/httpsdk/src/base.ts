import { fetch, RequestInit } from 'undici';

type Config = {
  apiKey?: string;
  baseUrl?: string;
};
export abstract class Base {
  private apiKey: string;

  private baseUrl: string;

  constructor(config?: Config) {
    this.apiKey = config.apiKey || '1234';
    this.baseUrl = config.baseUrl || 'https://jsonplaceholder.typicode.com';
  }

  protected async invoke<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey
    };

    const configOption = {
      ...options,
      headers
    };

    const response = await fetch(url, configOption);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json() as T;
  }
}
