import express from 'express';
import articleController from '../controllers/article.controller.js';


const initArticleRoutes = (app) => {
    const router = express.Router();

    router.get('/', (req, res) => articleController.readAll(req, res));

    router.get('/:id', (req, res) => {
        console.log('Route test OK');
    });

    router.post('/create', (req, res) => articleController.create(name, content, category));

    app.use('/article', router);
};

export default initArticleRoutes;