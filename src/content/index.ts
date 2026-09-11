import content from './site.json';
import { assetUrl } from '../lib/paths';

export const {
  site,
  directions,
  awards,
  resources,
  learningPaths,
  faq,
} = content;

export const projects = content.projects.map((item) => ({ ...item, image: assetUrl(item.image) }));
export const activities = content.activities.map((item) => ({ ...item, image: assetUrl(item.image) }));
export const culture = content.culture.map((item) => ({ ...item, image: assetUrl(item.image) }));
export const members = content.members.map((item) => ({ ...item, image: assetUrl(item.image) }));

export type Project = (typeof projects)[number];
export type Activity = (typeof activities)[number];
export type Member = (typeof members)[number];
export type Resource = (typeof resources)[number];
