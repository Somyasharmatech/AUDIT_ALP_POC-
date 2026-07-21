import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: '.data/pglite' // Not strictly needed for pglite if using custom scripts, but drizzle-kit might need connection
  }
});
