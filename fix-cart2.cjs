const fs = require('fs');
let content = fs.readFileSync('src/components/CartDrawer.tsx', 'utf8');

content = content.replace(/text-neutral-300/g, 'text-neutral-700');
content = content.replace(/text-amber-300/g, 'text-amber-700');
content = content.replace(/text-neutral-950/g, 'text-white'); // Fix the button text color (grand total etc might be wrong but we'll see)
content = content.replace(/bg-purple-950\/40/g, 'bg-purple-100');
content = content.replace(/bg-cyan-950\/40/g, 'bg-cyan-100');
content = content.replace(/bg-emerald-950\/40/g, 'bg-emerald-100');
content = content.replace(/bg-amber-950\/40/g, 'bg-amber-100');
content = content.replace(/text-purple-300/g, 'text-purple-700');
content = content.replace(/text-cyan-300/g, 'text-cyan-700');
content = content.replace(/text-emerald-300/g, 'text-emerald-700');
content = content.replace(/text-emerald-400/g, 'text-emerald-600');
content = content.replace(/text-purple-400/g, 'text-purple-600');
content = content.replace(/text-cyan-400/g, 'text-cyan-600');

fs.writeFileSync('src/components/CartDrawer.tsx', content);
