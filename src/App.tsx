import { useEffect, useRef } from 'react';
import { usePath } from './lib/router';
import { Layout } from './components/Layout';
import { activities, projects, site } from './content';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Activities from './pages/Activities';
import Awards from './pages/Awards';
import Members from './pages/Members';
import Resources from './pages/Resources';
import Join from './pages/Join';
import { ActivityDetail, NotFound, ProjectDetail } from './pages/Detail';
const names: Record<string,string> = {'/':'首页','/about':'协会介绍','/projects':'项目展示','/activities':'活动记录','/awards':'竞赛荣誉','/members':'协会成员','/resources':'学习资源','/join':'加入我们'};
export default function App() {
  const path = usePath();
  const first = useRef(true);
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
  const page = project ? <ProjectDetail project={project}/> : activity ? <ActivityDetail activity={activity}/> : path === '/' ? <Home/> : path === '/about' ? <About/> : path === '/projects' ? <Projects/> : path === '/activities' ? <Activities/> : path === '/awards' ? <Awards/> : path === '/members' ? <Members/> : path === '/resources' ? <Resources key={window.location.search}/> : path === '/join' ? <Join/> : <NotFound/>;
  return <Layout><main id="main" tabIndex={-1} key={path}>{page}</main></Layout>;
}
