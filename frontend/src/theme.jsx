import { createContext, useContext, useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════
   DARK TOKEN SET
   ═══════════════════════════════════════════════════════ */
export const DARK = {
  bg:       '#080808',
  bgCard:   '#0f0f0f',
  bgCard2:  '#141414',
  bgCard3:  '#1a1a1a',
  white:    '#ffffff',
  offW:     '#f0f0f0',
  grey:     '#888888',
  greyD:    '#444444',
  orange:   '#ff8800',
  orangeL:  '#ffaa33',
  orangeD:  '#cc6e00',
  line:     'rgba(255,255,255,0.08)',
  lineO:    'rgba(255,136,0,0.3)',
  lineOH:   'rgba(255,136,0,0.55)',
  btnGrad:  'linear-gradient(135deg,#ff8800,#ffaa33)',
  txtGrad:  'linear-gradient(90deg,#ff8800,#ffcc55)',
  red:      '#ef4444',
  green:    '#22c55e',
  amber:    '#f59e0b',
  shadow:   '0 8px 32px rgba(0,0,0,0.6)',
  shadowO:  '0 8px 32px rgba(255,136,0,0.15)',
};

/* ═══════════════════════════════════════════════════════
   LIGHT TOKEN SET
   ═══════════════════════════════════════════════════════ */
export const LIGHT = {
  bg:       '#f5f5f0',
  bgCard:   '#ffffff',
  bgCard2:  '#f0ede8',
  bgCard3:  '#e8e5e0',
  white:    '#111111',          // text "white" = dark in light mode
  offW:     '#222222',
  grey:     '#666666',
  greyD:    '#aaaaaa',
  orange:   '#e07000',          // slightly darker orange for contrast on white
  orangeL:  '#ff8800',
  orangeD:  '#b85a00',
  line:     'rgba(0,0,0,0.1)',
  lineO:    'rgba(224,112,0,0.35)',
  lineOH:   'rgba(224,112,0,0.6)',
  btnGrad:  'linear-gradient(135deg,#e07000,#ff8800)',
  txtGrad:  'linear-gradient(90deg,#e07000,#ff9900)',
  red:      '#dc2626',
  green:    '#16a34a',
  amber:    '#d97706',
  shadow:   '0 8px 32px rgba(0,0,0,0.1)',
  shadowO:  '0 8px 32px rgba(224,112,0,0.15)',
};

/* ═══════════════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════════════ */
const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('screen-ai-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.style.background = mode === 'dark' ? DARK.bg : LIGHT.bg;
    localStorage.setItem('screen-ai-theme', mode);
  }, [mode]);

  const toggle = () => setMode(m => m === 'dark' ? 'light' : 'dark');
  const T = mode === 'dark' ? DARK : LIGHT;

  return (
    <ThemeCtx.Provider value={{ mode, toggle, T }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}

/* ═══════════════════════════════════════════════════════
   SVG LOGO  (works on any bg)
   ═══════════════════════════════════════════════════════ */
export function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="11" fill="#ff8800"/>
      <rect x="12" y="9" width="18" height="24" rx="2.5" stroke="white" strokeWidth="2"/>
      <line x1="16" y1="16" x2="26" y2="16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16" y1="21" x2="26" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16" y1="26" x2="22" y2="26" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="34" cy="34" r="9" fill="#ff8800"/>
      <path d="M34 29v10M29 34h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   BACKWARD COMPAT — default export T = dark tokens
   (components that import { T } still work)
   ═══════════════════════════════════════════════════════ */
export const T = DARK;
export default DARK;
