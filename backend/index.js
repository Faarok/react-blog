import './config.js';
import express from 'express';
import initRoutes from './routes/init.routes.js';
import initMiddlewares from './middlewares/init.middlewares.js';
import initErrorMiddleware from './middlewares/error.middlewares.js';

const app = express();
const PORT = process.env.APP_PORT ?? 5000;

initMiddlewares(app);
initRoutes(app);
initErrorMiddleware(app);

app.listen(PORT, () => {
    if(process.env.APP_ENV == 'dev')
        console.log('Example app listening on port ' + PORT);
});