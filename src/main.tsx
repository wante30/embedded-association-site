import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import './index.css';
import { projects } from './data';
import { Shell } from './components';
import { useScrollTopOnNav } from './lib';
import { Home } from './home';
import { About } from './about';
import { Projects, ProjectDetail } from './projects';
import { Awards } from './awards';
import { Activities } from './activities';
import { Members } from './members';
import { Resources } from './resources';
import { Join } from './join';

function ProjectDetailRoute() {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug);
  return p ? <ProjectDetail p={p} /> : <Projects />;
}

function AppRoutes() {
  const loc = useLocation();
  useScrollTopOnNav(loc.pathname);
  return (
    <Shell>
      <Routes location={loc}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetailRoute />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/members" element={<Members />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/join" element={<Join />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Shell>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
