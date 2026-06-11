/* Shared design tokens — black / white / orange */
export const T = {
  black:    '#000000',
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
};

/* Reusable SVG logo — orange square + doc icon */
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
