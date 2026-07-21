import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';
import { migrate } from 'drizzle-orm/pglite/migrator';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), '.data', 'pglite');
if (!fs.existsSync(path.join(process.cwd(), '.data'))) {
    fs.mkdirSync(path.join(process.cwd(), '.data'));
}
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Persist database to disk
export const client = new PGlite(dataDir);
export const db = drizzle(client, { schema });

// Run migrations and table alignment on startup
export const initDb = async () => {
    if (process.env.SKIP_DB_INIT === 'true') {
        console.log("Skipping DB initialization (SKIP_DB_INIT is true)");
        return;
    }

    try {
        if (process.env.NODE_ENV === 'production') {
            // In production, we might want to check a flag or just run it once.
            // For now, we'll keep it but allow skipping via env var.
            console.log("Running DB migrations in production mode...");
        } else {
            console.log("Running DB migrations...");
        }

        await migrate(db, { migrationsFolder: './drizzle' });
        console.log("DB migrations completed!");
    } catch (e) {
        console.error("Migration failed", e);
    }
}
