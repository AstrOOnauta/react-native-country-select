import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: [
    'react',
    'react-native',
    'react-native-safe-area-context',
  ],
  loader: {
    '.json': 'json',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
