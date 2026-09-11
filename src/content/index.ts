import content from './site.json';
export const { site, directions, projects, activities, culture, awards, members, resources, learningPaths, faq } = content;
export type Project = (typeof projects)[number];
export type Activity = (typeof activities)[number];
export type Member = (typeof members)[number];
export type Resource = (typeof resources)[number];
