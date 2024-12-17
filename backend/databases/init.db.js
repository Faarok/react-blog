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

// Fonction pour obtenir une connexion à la base de données
const getDbConnection = async () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                // Gestion des erreurs de connexion
                if (tools.strToBool(process.env.MYSQL_DEBUG)) {
                    tools.log(err.stack, 'sql_stack', 'error');
                }
                tools.log(err.message, 'sql', 'error');
                return reject(err); // Rejeter l'erreur
            }

            resolve(connection); // Renvoie la connexion si aucune erreur
        });
    });
};

// Fonction pour effectuer une requête avec le pool de connexions
const poolQuery = async (query, data = []) => {
    try {
        const connection = await getDbConnection();
        const [rows] = await connection.promise().execute(query, data);
        connection.release();
        return [rows];
    }
    catch (err)
    {
        throw err;
    }
};

export default { pool, poolQuery, queryBuilder };