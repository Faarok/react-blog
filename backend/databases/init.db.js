import mysql from 'mysql2';
import queryBuilder from './queryBuilder.db.js';
import { tools } from '../functions.js';

// details at : https://sidorares.github.io/node-mysql2/docs
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,  // Limite de connexions simultanées
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if(err)
    {
        if(tools.strToBool(process.env.MYSQL_DEBUG))
            tools.log(err.stack, 'sql_complete', 'error');

        return tools.log(err.message, 'sql', 'error');
    }

    connection.release();  // Libère la connexion une fois la tâche terminée
});

const poolQuery = (query, data = []) => pool.promise().execute(query, data);

export default { pool, poolQuery, queryBuilder };