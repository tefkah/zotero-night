export const defaultFilters = {
  none: { filter: 'none', icon: '☀️', displayName: 'None', name: 'none' },
  nord: {
    filter:
      'invert(85%) sepia(70%) saturate(220%) hue-rotate(179deg) brightness(99%) contrast(90%)',
    icon: '✨',
    name: 'nord',
    displayName: 'Nord',
  },
  dark: {
    filter:
      'brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg)',
    icon: '🌙',
    name: 'dark',
    displayName: 'Dark',
  },
} as const
