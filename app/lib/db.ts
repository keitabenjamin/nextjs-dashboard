import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
    throw new Error('Missing POSTGRES_URL environment variable');
}
export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

