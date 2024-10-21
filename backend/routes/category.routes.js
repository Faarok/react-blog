import express from 'express';
import categoryController from '../controllers/category.controller.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();
const router = express.Router();

const initCategoryRoutes = (app) => {
    router.get('/', jsonParser, categoryController.getActiveCategories);
    router.post('/create', jsonParser, categoryController.createCategory);

    app.use('/category', router);
}

export default initCategoryRoutes;