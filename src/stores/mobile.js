import { writable } from 'svelte/store';

// Active panel tab on mobile bottom nav
// Possible values: null | 'tools' | 'text' | 'images' | 'theme' | 'layers' | 'export'
/** @type {import('svelte/store').Writable<string|null>} */
export const activeMobileTab = writable(null);

// Whether the mobile drawer is open
export const drawerOpen = writable(false);

export function openTab(tab) {
  activeMobileTab.set(tab);
  drawerOpen.set(true);
}

export function closeDrawer() {
  drawerOpen.set(false);
  // Don't clear activeMobileTab so the tab stays highlighted
}

export function toggleTab(tab) {
  activeMobileTab.update(current => {
    if (current === tab) {
      drawerOpen.set(false);
      return null;
    } else {
      drawerOpen.set(true);
      return tab;
    }
  });
}
