import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  // Source maps are ~5.6 MB of the published tarball and are not usable by a
  // consumer debugging their own app.
  sourcemap: false,
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
