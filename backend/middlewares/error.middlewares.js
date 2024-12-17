import { tools } from "../functions.js";

const codeToFile = {
    sql: 'ER_PARSE_ERROR'
}

const initErrorMiddleware = (app) => {
    // Middleware global pour gérer les erreurs
    app.use((err, req, res, next) => {
        const foundKey = Object.entries(codeToFile).find(([key, value]) => value === err.code) ?.[0];
        let fileCode = 'error';

        if(typeof foundKey !== 'undefined')
            fileCode = foundKey;

        console.error('Error captured:', err.message);
        tools.log(err.message, fileCode, 'error');

        console.error(err.stack);
        tools.log(err.stack, `${fileCode}_stack`, 'error');

        // Répondre avec une erreur HTTP
        res.status(500).json({
            error: 'An unexpected error occurred',
            message: process.env.APP_ENV === 'dev' ? err.message : 'Something went wrong, please try again later.'
        });
    });
}

export default initErrorMiddleware;