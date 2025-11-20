const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Navigate to the project root directory (outside node_modules)
function findProjectRoot() {
  let current = process.cwd();

  // If we're inside node_modules, go up until we're out
  while (current.includes('node_modules')) {
    current = path.dirname(current);
  }

  // Look for the project's package.json
  while (!fs.existsSync(path.join(current, 'package.json'))) {
    const next = path.dirname(current);
    if (next === current) break;
    current = next;
  }

  return current;
}

const root = findProjectRoot();
process.chdir(root);

// Check if react-native-safe-area-context is already installed
function isPackageInstalled() {
  const packagePath = path.join(
    root,
    'node_modules',
    'react-native-safe-area-context'
  );

  if (fs.existsSync(packagePath)) {
    console.log(
      '✅ react-native-safe-area-context is already installed!\n'
    );
    return true;
  }

  return false;
}

// If already installed, do nothing
if (isPackageInstalled()) {
  process.exit(0);
}

function detectPackageManager() {
  if (fs.existsSync(path.join(root, 'bun.lockb'))) return 'bun';
  if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(root, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

const pm = detectPackageManager();

const commands = {
  npm: 'npm install react-native-safe-area-context@latest --save',
  yarn: 'yarn add react-native-safe-area-context@latest',
  pnpm: 'pnpm add react-native-safe-area-context@latest',
  bun: 'bun add react-native-safe-area-context@latest',
};

const command = commands[pm] || commands.npm;

try {
  console.log(`\n🔧 Detected package manager: ${pm}`);
  console.log(`📦 Installing react-native-safe-area-context using:`);
  console.log(`➡️  ${command}\n`);

  execSync(command, { stdio: 'inherit' });

  console.log(
    `\n✅ react-native-safe-area-context installed successfully!\n`
  );
} catch (err) {
  console.error(
    '\n⚠️  Could not automatically install react-native-safe-area-context'
  );
  console.error('Please install it manually by running:\n');
  console.error(`   ${command}\n`);
}
