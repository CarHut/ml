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

    async getLastModelId() {
        try {
            const pool = new Pool(dbConfig);
            const client = await pool.connect();
            try {
                const result = await client.query('SELECT MAX(id) AS max_id FROM bazos_data_scraping;');
                return result.rows[0]?.max_id || null;
            } finally {
                client.release(); 
            }
        } catch (err) {
            console.error('Error connecting to the database:', err.stack);
            return null;
        }
    }
    async getUncheckedLinks(links) {
        const pool = new Pool(dbConfig);
        const uncheckedLinks = [];
        try {
            for (const link of links) {
                const client = await pool.connect();
                const prefix = 'https://auto.bazos.sk';
                const result = await client.query(`SELECT * FROM bazos_data_scraping WHERE link = '${prefix + link['href']}';`);
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