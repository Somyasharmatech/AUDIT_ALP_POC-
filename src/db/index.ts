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

// Run migrations on startup
export const initDb = async () => {
    try {
        console.log("Running DB migrations...");
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log("DB migrations completed!");
    } catch (e) {
        console.error("Migration failed", e);
    }
}
