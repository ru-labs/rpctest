import { parse } from 'tldjs';
export function providerFromEndpoint(endpoint: string): string {
  const domain = parse(endpoint).domain;
  return domain || endpoint;
}