const fs = require('fs');
let content = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

// Replace background and borders
content = content.replace(/bg-neutral-900/g, 'bg-neutral-50');
content = content.replace(/bg-neutral-950\/80/g, 'bg-black/60');
content = content.replace(/bg-neutral-950\/60/g, 'bg-neutral-100');
content = content.replace(/bg-neutral-950/g, 'bg-white');
content = content.replace(/bg-neutral-800\/80/g, 'bg-neutral-100');
content = content.replace(/bg-neutral-800/g, 'bg-neutral-200');
content = content.replace(/border-neutral-800/g, 'border-neutral-200');

// Replace text colors
content = content.replace(/text-neutral-400/g, 'text-neutral-600');
content = content.replace(/text-neutral-500/g, 'text-neutral-500');
content = content.replace(/text-white/g, 'text-neutral-900');
content = content.replace(/text-neutral-200/g, 'text-neutral-800');

// Hover states
content = content.replace(/hover:text-white/g, 'hover:text-neutral-900');
content = content.replace(/hover:bg-neutral-800/g, 'hover:bg-neutral-100');

// Amber/Red to fit light mode better (optional but keep as is for now, just text-amber-400 -> text-amber-600 might be needed? No, amber-500 is fine)
content = content.replace(/text-amber-400/g, 'text-[#E6192B]'); // Use brand red maybe? No, let's keep amber or red. In the screenshot, "Tu Pedido Buchisapa" icon is amber-400. Let's keep it amber-500.
content = content.replace(/text-amber-400/g, 'text-amber-500');

fs.writeFileSync('src/components/CartDrawer.tsx', content);
