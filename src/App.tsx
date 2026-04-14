/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Team } from "./pages/Team";
import { Fixtures } from "./pages/Fixtures";
import { Gallery } from "./pages/Gallery";
import { News } from "./pages/News";
import { Join } from "./pages/Join";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

// Lazy load Admin — most users never visit this page
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })));

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
        <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="team" element={<Team />} />
          <Route path="fixtures" element={<Fixtures />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="news" element={<News />} />
          <Route path="join" element={<Join />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><Admin /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
