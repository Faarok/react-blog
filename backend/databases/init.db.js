import mysql from 'mysql2';
import queryBuilder from './queryBuilder.db.js';

const ACTIVE = 'published';
const INACTIVE = 'deleted';
const ARCHIVED = 'archived';

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
        return console.error('Erreur de connexion à la base de données :', err.stack);

    console.log('Connecté à la base de données avec l\'ID :', connection.threadId);
    connection.release();  // Libère la connexion une fois la tâche terminée
});

const poolQuery = (query, data = []) => db.pool.promise().execute(query, data);

export default { pool, poolQuery, queryBuilder, ACTIVE, INACTIVE, ARCHIVED };