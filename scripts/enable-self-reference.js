var fs = require('fs');
var path = require('path');





// Create a symlink at `node_modules/rtti` pointing to `dist/release`
try {
    var linkFrom = path.join(__dirname, '../node_modules/rtti');
    var linkTo = path.join(__dirname, '../dist/commonjs');
    fs.symlinkSync(linkTo, linkFrom, 'junction');
}
catch (err) {
    // An EEXIST error implies we already have a self-ref, in which case we ignore and continue. 
    if (err.code === 'EEXIST') return;

    // Re-throw any other error.
    throw err;
}
