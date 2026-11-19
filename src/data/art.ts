/**
 * Inline SVG illustrations, one per project slug, drawn with the site's CSS
 * variables so they follow the active theme.
 *
 * Kept as strings because they are injected with set:html inside a container that
 * is aria-hidden: they carry no information, only texture. Nothing here loads a
 * file or a font, so adding a project costs no request. getArt returns an empty
 * string for an unknown slug, which leaves the container empty instead of breaking
 * the layout.
 */
export const art: Record<string, string> = {
  "ollama-inference-benchmarks": `<svg viewBox="0 0 640 360" role="presentation" focusable="false">
  <g stroke="var(--line-strong)" stroke-width="1.2" fill="none">
    <path d="M60 300h520M60 60v240"/>
  </g>
  <g fill="var(--accent)" opacity=".22">
    <rect x="96" y="212" width="46" height="88" rx="5"/>
    <rect x="158" y="168" width="46" height="132" rx="5"/>
    <rect x="220" y="238" width="46" height="62" rx="5"/>
  </g>
  <g fill="var(--accent-2)" opacity=".20">
    <rect x="300" y="128" width="46" height="172" rx="5"/>
    <rect x="362" y="186" width="46" height="114" rx="5"/>
    <rect x="424" y="96" width="46" height="204" rx="5"/>
  </g>
  <path d="M96 236 158 196 220 262 300 152 362 210 424 118 500 172" fill="none"
        stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="var(--bg)" stroke="var(--accent)" stroke-width="2">
    <circle cx="96" cy="236" r="4.5"/><circle cx="158" cy="196" r="4.5"/><circle cx="220" cy="262" r="4.5"/>
    <circle cx="300" cy="152" r="4.5"/><circle cx="362" cy="210" r="4.5"/><circle cx="424" cy="118" r="4.5"/>
  </g>
  <g stroke="var(--ink-mute)" stroke-width="1.4" opacity=".55">
    <path d="M96 300v-6M158 300v-6M220 300v-6M300 300v-6M362 300v-6M424 300v-6M500 300v-6"/>
  </g>
</svg>`,
  "hermes-infrastructure": `<svg viewBox="0 0 640 360" role="presentation" focusable="false">
  <g stroke="var(--line-strong)" stroke-width="1.1" opacity=".9">
    <path d="M320 180 176 96M320 180 176 264M320 180 468 96M320 180 468 264"/>
  </g>
  <g stroke="var(--accent)" stroke-width="1.6" opacity=".55">
    <path d="M176 96h0M468 96h0"/>
  </g>
  <rect x="286" y="146" width="68" height="68" rx="14" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
  <path d="M306 180h28M320 166v28" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"/>
  <g fill="var(--bg-elev)" stroke="var(--accent-2)" stroke-width="1.8">
    <rect x="146" y="70" width="60" height="52" rx="9"/>
    <rect x="146" y="238" width="60" height="52" rx="9"/>
    <rect x="438" y="70" width="60" height="52" rx="9"/>
    <rect x="438" y="238" width="60" height="52" rx="9"/>
  </g>
  <g stroke="var(--ink-mute)" stroke-width="1.6" opacity=".7" stroke-linecap="round">
    <path d="M162 92h28M162 104h18M162 260h28M162 272h18M454 92h28M454 104h18M454 260h28M454 272h18"/>
  </g>
  <g fill="var(--ok)" opacity=".85">
    <circle cx="320" cy="118" r="3"/><circle cx="320" cy="242" r="3"/>
  </g>
</svg>`,
  "alfred": `<svg viewBox="0 0 640 360" role="presentation" focusable="false">
  <g fill="none" stroke="var(--line-strong)" stroke-width="1.2" opacity=".8">
    <circle cx="320" cy="180" r="118"/><circle cx="320" cy="180" r="88"/>
  </g>
  <path d="M320 108l62 24v52c0 40-26 66-62 80-36-14-62-40-62-80v-52Z"
        fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2.4" stroke-linejoin="round"/>
  <g stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-linecap="round">
    <rect x="300" y="168" width="40" height="34" rx="7"/>
    <path d="M308 168v-10a12 12 0 0 1 24 0v10"/>
    <path d="M320 182v8"/>
  </g>
  <g fill="var(--accent-2)" opacity=".5">
    <circle cx="202" cy="180" r="4"/><circle cx="438" cy="180" r="4"/>
  </g>
</svg>`,
  "portfolio-manager": `<svg viewBox="0 0 640 360" role="presentation" focusable="false">
  <g fill="var(--bg-elev)" stroke="var(--line-strong)" stroke-width="1.4">
    <rect x="132" y="86" width="176" height="200" rx="10" opacity=".55"/>
    <rect x="152" y="102" width="176" height="200" rx="10" opacity=".75"/>
  </g>
  <rect x="176" y="118" width="200" height="200" rx="10" fill="var(--bg-elev)" stroke="var(--accent)" stroke-width="2"/>
  <g stroke="var(--ink-mute)" stroke-width="1.6" stroke-linecap="round" opacity=".75">
    <path d="M200 156h96M200 178h140M200 200h112M200 222h132"/>
  </g>
  <g stroke="var(--accent)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M404 176l-16 18 16 18M448 176l16 18-16 18M436 168l-20 52"/>
  </g>
  <circle cx="426" cy="268" r="26" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
  <path d="M414 268l8 8 16-18" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  "palantir-research-workflow": `<svg viewBox="0 0 640 360" role="presentation" focusable="false">
  <g fill="none" stroke="var(--line-strong)" stroke-width="1.3">
    <path d="M120 92h140l60 66-60 66H120z"/>
    <path d="M360 224h60"/>
  </g>
  <g fill="var(--accent)" opacity=".18">
    <path d="M120 92h140l60 66H120z"/>
  </g>
  <g fill="var(--accent-2)" opacity=".16">
    <path d="M120 158h200l-60 66H120z"/>
  </g>
  <g fill="var(--bg-elev)" stroke="var(--accent)" stroke-width="2">
    <circle cx="176" cy="300" r="0"/>
  </g>
  <g stroke="var(--accent)" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M120 92h140l60 66-60 66H120z"/>
    <path d="M444 132v96l32 32 32-32v-96"/>
    <path d="M476 156v72"/>
  </g>
  <g fill="var(--ink-mute)" opacity=".6">
    <circle cx="160" cy="116" r="3.4"/><circle cx="160" cy="180" r="3.4"/>
  </g>
  <g stroke="var(--ink-mute)" stroke-width="1.4" opacity=".5" stroke-linecap="round">
    <path d="M420 300h96M420 288h64"/>
  </g>
</svg>`,
  "site-t-konate": `<svg viewBox="0 0 640 360" role="presentation" focusable="false">
  <rect x="96" y="72" width="448" height="228" rx="12" fill="var(--bg-elev)" stroke="var(--line-strong)" stroke-width="1.6"/>
  <path d="M96 118h448" stroke="var(--line-strong)" stroke-width="1.4"/>
  <g fill="var(--ink-mute)" opacity=".55">
    <circle cx="122" cy="95" r="4.5"/><circle cx="140" cy="95" r="4.5"/><circle cx="158" cy="95" r="4.5"/>
  </g>
  <g fill="var(--accent)" opacity=".14">
    <rect x="122" y="146" width="150" height="34" rx="6"/>
    <rect x="122" y="196" width="192" height="12" rx="4"/>
    <rect x="122" y="218" width="160" height="12" rx="4"/>
  </g>
  <g fill="var(--accent-2)" opacity=".14">
    <rect x="306" y="146" width="104" height="84" rx="8"/>
    <rect x="426" y="146" width="94" height="84" rx="8"/>
  </g>
  <g fill="none" stroke="var(--accent)" stroke-width="2" opacity=".85">
    <rect x="306" y="146" width="104" height="84" rx="8"/>
  </g>
  <g stroke="var(--ink-mute)" stroke-width="1.4" opacity=".6">
    <rect x="122" y="252" width="66" height="26" rx="13"/>
  </g>
  <text x="138" y="270" font-family="monospace" font-size="13" fill="var(--ink-soft)">FR</text>
  <text x="196" y="270" font-family="monospace" font-size="13" fill="var(--ink-mute)">EN</text>
</svg>`,
};

export const getArt = (slug: string) => art[slug] ?? '';