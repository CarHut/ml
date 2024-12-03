import pkg from 'pg';
const { Pool } = pkg;

// Database configuration
const dbConfig = {
    user: 'postgres',         
    host: 'localhost',        
    database: 'postgres',    
    password: 'janik',    
    port: 5432,                 
};

class PgConnection {
    async executePgQuery(query) {
        const pool = new Pool(dbConfig);
    
        try {
            console.log('Connecting to the database...');
            const client = await pool.connect();
            const result = await client.query(`${query}`);
            client.release();
        } catch (err) {
            console.error('Error connecting to the database:', err.stack);
        } finally {
            await pool.end();
        }
    }
}

export default PgConnection;