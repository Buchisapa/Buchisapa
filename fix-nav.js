const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Find the last }
// Wait, looking at the tail output, we have:
/*
   478	        </div>
   479	      )}
   480	    </header>
   481	  );
   482	};
   483	
   484	  );
   485	};
*/
// I will just trim the extra ones.
code = code.replace(/<\/header>\n  \);\n};\n\n  \);\n};/, '</header>\n  );\n};\n\nexport default Navbar;\n');
fs.writeFileSync('src/components/Navbar.tsx', code);
