import { copyFile } from 'fs/promises';
import path from 'path';

async function postBuild() {
  try {
    // Copiar .htaccess para a pasta dist
    await copyFile(
      path.resolve('public', '.htaccess'),
      path.resolve('dist', '.htaccess')
    );
    
    console.log('Post-build tasks completed successfully!');
  } catch (error) {
    console.error('Error during post-build:', error);
    process.exit(1);
  }
}

postBuild();
