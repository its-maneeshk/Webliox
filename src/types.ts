/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppCategory = 'All' | 'AI' | 'Design' | 'Productivity' | 'Entertainment' | 'Social' | 'Utility' | 'Custom';

export interface WebApp {
  id: string;
  name: string;
  url: string;
  category: AppCategory;
  iconName: string; // Lucide icon identifier
  color: string;     // Tailwind gradient or solid color config
  isFavorite: boolean;
  isCustom?: boolean;
}

export interface SearchQuery {
  text: string;
  category: AppCategory;
}

export interface LauncherState {
  apps: WebApp[];
  selectedApp: WebApp | null;
  currentCategory: AppCategory;
  searchQuery: string;
  isDeviceMode: boolean; // Toggle between full screen and Android mock phone frame
}
