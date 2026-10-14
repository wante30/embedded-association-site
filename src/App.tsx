import { useEffect, useRef } from 'react';
import { usePath } from './lib/router';
import { useScrollReveal } from './lib/useScrollReveal';
import { Layout } from './components/Layout';
import { activities, projects, site } from './content';
import pageTitles from './content/routes.json';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Activities from './pages/Activities';
import Awards from './pages/Awards';
import Members from './pages/Members';
import Resources from './pages/Resources';
import Join from './pages/Join';
import { ActivityDetail, NotFound, ProjectDetail } from './pages/Detail';
const names: Record<string,string> = pageTitles;
export default function App() {
  const path = usePath();
  const first = useRef(true);
  const main = useRef<HTMLElement>(null);
  const project = path.startsWith('/projects/') ? projects.find(p => `/projects/${p.id}` === path) : undefined;
  const activity = path.startsWith('/activities/') ? activities.find(a => `/activities/${a.id}` === path) : undefined;
  const title = project?.name || activity?.title || names[path] || '页面未找到';
  useEffect(() => {
    document.title = `${title} · ${site.name}`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', project?.summary || activity?.summary || site.description);
    if (!first.current) { window.scrollTo(0,0); document.getElementById('main')?.focus({preventScroll:true}); }
    first.current = false;
  },[path,title,project,activity]);
  useScrollReveal(main, path);
  const page = project ? <ProjectDetail project={project}/> : activity ? <ActivityDetail activity={activity}/> : path === '/' ? <Home/> : path === '/about' ? <About/> : path === '/projects' ? <Projects/> : path === '/activities' ? <Activities/> : path === '/awards' ? <Awards/> : path === '/members' ? <Members/> : path === '/resources' ? <Resources key={window.location.search}/> : path === '/join' ? <Join/> : <NotFound/>;
  return <Layout><main ref={main} id="main" tabIndex={-1} key={path}>{page}</main></Layout>;
}
