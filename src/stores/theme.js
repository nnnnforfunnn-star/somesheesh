import { writable } from 'svelte/store';

// Available design themes
export const THEMES = {
  darkroom: {
    id: 'darkroom',
    label: 'DARKROOM',
    description: 'Темная лаборатория',
    backgroundColor: '#121212',
    primaryColor: '#E8E8E8',
    accentColor: '#8B0000',
    textColor: '#E8E8E8',
    fontFamily: 'Roboto Mono',
    borderColor: '#333333',
  },
  evidence: {
    id: 'evidence',
    label: 'EVIDENCE',
    description: 'Доска улик',
    backgroundColor: '#1A1410',
    primaryColor: '#D2B48C',
    accentColor: '#8B0000',
    textColor: '#D2B48C',
    fontFamily: 'Roboto Mono',
    borderColor: '#4A3728',
  },
  newspaper: {
    id: 'newspaper',
    label: 'NEWSPAPER',
    description: 'Газетная вырезка',
    backgroundColor: '#C8B89A',
    primaryColor: '#1A1A1A',
    accentColor: '#8B0000',
    textColor: '#1A1A1A',
    fontFamily: 'Roboto Mono',
    borderColor: '#8B7355',
  },
};

// Currently active theme ID
export const currentThemeId = writable('darkroom');

// Derived: active theme object
import { derived } from 'svelte/store';

export const currentTheme = derived(
  currentThemeId,
  $id => THEMES[$id] ?? THEMES.darkroom
);

export function setTheme(id) {
  if (THEMES[id]) {
    currentThemeId.set(id);
  }
}
