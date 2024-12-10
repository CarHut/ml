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
            const client = await pool.connect();
            const result = await client.query(`${query}`);
            client.release();
        } catch (err) {
            console.error('Error connecting to the database:', err.stack);
        } finally {
            await pool.end();
        }
    }

    async getUncheckedLinks(links) {
        const pool = new Pool(dbConfig);
        const uncheckedLinks = [];
        try {
            for (const link of links) {
                const client = await pool.connect();
                const result = await client.query(`SELECT * FROM autobazar_eu WHERE link = '${link}';`);
                if (result.rowCount === 0) {
                    uncheckedLinks.push(link);
                }
                client.release();
            }
        } catch (err) {
            console.error('Error connecting to the database:', err.stack);
            return [];
        } finally {
            await pool.end();
        }

        return uncheckedLinks;
    } 
}

export default PgConnection;