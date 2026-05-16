/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Admin from './pages/Admin';
import Login from './pages/Login';
import WorkDetail from './pages/WorkDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with navigation header/footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<WorkDetail />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Minimal/Standalone pages */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
