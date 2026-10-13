import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function publicRoutes(pageTitles, content) {
  const routes = [
    ...Object.keys(pageTitles),
    ...content.projects.map(project => `/projects/${project.id}`),
    ...content.activities.map(activity => `/activities/${activity.id}`),
  ];
  if (new Set(routes).size !== routes.length || routes.some(route => route !== '/' && !/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(route))) {
    throw new Error('Public routes must be unique, safe directory paths');
  }
  return routes;
}

export async function writeRouteEntries(outDir, routes) {
  const html = await readFile(join(outDir, 'index.html'), 'utf8');
  for (const route of routes.filter(route => route !== '/')) {
    const directory = join(outDir, route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), html, 'utf8');
  }
  // Unknown URLs retain the existing application 404, with HTTP status 404.
  await writeFile(join(outDir, '404.html'), html, 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
  const routes = publicRoutes(await readJson('../src/content/routes.json'), await readJson('../src/content/site.json'));
  await writeRouteEntries(fileURLToPath(new URL('../dist/', import.meta.url)), routes);
  console.log(`Prepared ${routes.length} public route entries and 404.html`);
}
