import express from 'express';
import articleController from '../controllers/article.controller.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const initArticleRoutes = (app) => {
    const router = express.Router();

    router.post('/create', jsonParser, articleController.create);

    app.use('/article', router);
};

export default initArticleRoutes;