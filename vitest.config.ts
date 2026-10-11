// Unit tests (Fáze 5): pure logic and the lead API, run in Node with `npm test`.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
