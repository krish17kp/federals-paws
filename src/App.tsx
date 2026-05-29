/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { Dashboard } from './components/Dashboard';
import { useState } from 'react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-dvh w-full flex overflow-hidden bg-background font-sans text-[14px]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Dashboard searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
}
