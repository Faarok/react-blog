import express from 'express';
import articleController from '../controllers/article.controller.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();
const router = express.Router();

const initArticleRoutes = (app) => {
    // router.get('/', jsonParser, articleController.get)
    router.post('/create', jsonParser, asyncHandler(articleController.createArticle));

    app.use('/article', router);
};

export default initArticleRoutes;