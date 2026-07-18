/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WebApp } from './types';
import DeviceFrame from './components/DeviceFrame';
import LauncherHome from './components/LauncherHome';
import WebPreviewer from './components/WebPreviewer';
import AddWebsiteForm from './components/AddWebsiteForm';

// Initial preloaded default applications
const DEFAULT_APPS: WebApp[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'AI',
    iconName: 'MessageSquare',
    color: 'from-emerald-500 to-teal-600',
    isFavorite: true,
  },
  {
    id: 'canva',
    name: 'Canva',
    url: 'https://www.canva.com',
    category: 'Design',
    iconName: 'Palette',
    color: 'from-blue-500 to-indigo-600',
    isFavorite: false,
  },
  {
    id: 'photopea',
    name: 'Photopea Editor',
    url: 'https://www.photopea.com',
    category: 'Design',
    iconName: 'Camera',
    color: 'from-green-500 to-emerald-600',
    isFavorite: false,
  },
  {
    id: 'netflix',
    name: 'Netflix Stream',
    url: 'https://www.netflix.com',
    category: 'Entertainment',
    iconName: 'Tv',
    color: 'from-red-600 to-rose-700',
    isFavorite: false,
  },
  {
    id: 'notion',
    name: 'Notion Workspace',
    url: 'https://www.notion.so',
    category: 'Productivity',
    iconName: 'BookOpen',
    color: 'from-neutral-700 to-neutral-900',
    isFavorite: true,
  },
];

export default function App() {
  // Try to load state from browser's local storage (similar to AsyncStorage in React Native!)
  const [apps, setApps] = useState<WebApp[]>(() => {
    const saved = localStorage.getItem('webhub_apps_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to restore apps cache:', e);
      }
    }
    return DEFAULT_APPS;
  });

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('webhub_recents_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to restore recents cache:', e);
      }
    }
    return [];
  });

  const [selectedApp, setSelectedApp] = useState<WebApp | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'add-app'>('home');
  const [isDeviceMode, setIsDeviceMode] = useState(false);
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);

  // Sync launcher app state changes to local storage
  useEffect(() => {
    localStorage.setItem('webhub_apps_v1', JSON.stringify(apps));
  }, [apps]);

  // Sync recents to local storage
  useEffect(() => {
    localStorage.setItem('webhub_recents_v1', JSON.stringify(recentIds));
  }, [recentIds]);

  // Intercept browser back / physical device back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (!state) {
        setSelectedApp(null);
        setCurrentView('home');
        setIsMediaPlaying(false);
      } else if (state.appOpened) {
        const app = apps.find(a => a.id === state.appId);
        if (app) {
          setSelectedApp(app);
        } else {
          setSelectedApp(null);
        }
        setCurrentView('home');
        setIsMediaPlaying(false);
      } else if (state.view === 'add-app') {
        setSelectedApp(null);
        setCurrentView('add-app');
        setIsMediaPlaying(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [apps]);

  // Launch application portal
  const handleLaunchApp = (app: WebApp) => {
    setSelectedApp(app);
    setIsMediaPlaying(false);
    window.history.pushState({ appOpened: true, appId: app.id }, '');
    // Push to recents (and remove duplicates to bubble up the latest item)
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== app.id);
      return [app.id, ...filtered].slice(0, 4); // Limit to top 4 recent portals
    });
  };

  // Close website portal and go back to launcher dashboard
  const handleCloseApp = () => {
    setIsMediaPlaying(false);
    if (window.history.state && window.history.state.appOpened) {
      window.history.back();
    } else {
      setSelectedApp(null);
    }
  };

  // Triggered when refreshing web preview
  const handleRefreshApp = () => {
    if (selectedApp) {
      // Simulate reload trigger
      const current = selectedApp;
      setSelectedApp(null);
      setTimeout(() => setSelectedApp(current), 50);
    }
  };

  // Triggered when launching outward
  const handleLaunchExternal = () => {
    if (selectedApp) {
      window.open(selectedApp.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Add custom web app portal
  const handleAddApp = (newApp: Omit<WebApp, 'id' | 'isFavorite'>) => {
    const appRecord: WebApp = {
      ...newApp,
      id: `custom-${Date.now()}`,
      isFavorite: false,
      isCustom: true,
    };
    setApps(prev => [...prev, appRecord]);
    setCurrentView('home');
  };

  // Delete custom web app portal
  const handleDeleteApp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card tap launch
    setApps(prev => prev.filter(app => app.id !== id));
    setRecentIds(prev => prev.filter(recentId => recentId !== id));
  };

  // Star / Favorite toggle
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card tap launch
    setApps(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, isFavorite: !app.isFavorite };
      }
      return app;
    }));
  };

  // Map recent app IDs to actual app objects
  const recentApps = recentIds
    .map(id => apps.find(app => app.id === id))
    .filter((app): app is WebApp => !!app);

  return (
    <DeviceFrame
      isDeviceMode={isDeviceMode}
      setIsDeviceMode={setIsDeviceMode}
      selectedAppName={selectedApp ? selectedApp.name : null}
      onGoBack={selectedApp ? handleCloseApp : undefined}
      onRefresh={selectedApp ? handleRefreshApp : undefined}
      onLaunchExternal={selectedApp ? handleLaunchExternal : undefined}
      isMediaPlaying={isMediaPlaying}
    >
      {selectedApp ? (
        <WebPreviewer 
          app={selectedApp} 
          onClose={handleCloseApp} 
          onMediaPlaying={setIsMediaPlaying} 
        />
      ) : currentView === 'add-app' ? (
        <AddWebsiteForm 
          onAddApp={handleAddApp} 
          onCancel={() => {
            if (window.history.state && window.history.state.view === 'add-app') {
              window.history.back();
            } else {
              setCurrentView('home');
            }
          }} 
        />
      ) : (
        <LauncherHome
          apps={apps}
          onLaunchApp={handleLaunchApp}
          onAddAppClick={() => {
            setCurrentView('add-app');
            window.history.pushState({ view: 'add-app' }, '');
          }}
          onToggleFavorite={handleToggleFavorite}
          onDeleteApp={handleDeleteApp}
          recentApps={recentApps}
        />
      )}
    </DeviceFrame>
  );
}
