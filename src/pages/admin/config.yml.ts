import type { APIRoute } from 'astro';
import raw from '../../data/cms-config.yml?raw';

/**
 * Decap CMS config, generated per environment so staging and production each log in
 * through their own /api/decap-auth. Set PUBLIC_CMS_REPO (owner/repo) in the deploy.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://hyderabadcampersclubhcc.in')).origin;
  const repo = import.meta.env.PUBLIC_CMS_REPO || 'hyderabadcampersclubhcc-rgb/Project-HCC';
  const body = raw.replaceAll('__SITE_ORIGIN__', origin).replaceAll('__CMS_REPO__', repo);
  return new Response(body, { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
};
