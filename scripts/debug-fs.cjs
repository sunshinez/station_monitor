const fs = require('fs');
const originalReadFile = fs.promises.readFile;

fs.promises.readFile = async function(path, ...args) {
  const pathStr = typeof path === 'string' ? path : path?.path || path?.toString?.() || '[unknown]';
  console.log('[FS_READFILE]', pathStr);
  return originalReadFile(path, ...args);
};

const originalReadFileSync = fs.readFileSync;
fs.readFileSync = function(path, ...args) {
  const pathStr = typeof path === 'string' ? path : path?.path || path?.toString?.() || '[unknown]';
  console.log('[FS_READFILE_SYNC]', pathStr);
  return originalReadFileSync(path, ...args);
};
