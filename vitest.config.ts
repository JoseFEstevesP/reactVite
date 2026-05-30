import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@page': path.resolve(__dirname, './src/page'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		setupFiles: ['./src/test/setup.ts'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/**/*.{test,spec}.{ts,tsx}',
				'src/**/*.d.ts',
				'src/vite-env.d.ts',
				'src/main.tsx',
			],
			thresholds: {
				branches: 20,
				functions: 20,
				lines: 30,
				statements: 25,
			},
		},
	},
});
