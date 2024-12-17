import express from 'express';
import categoryController from '../controllers/category.controller.js';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();
const router = express.Router();

const initCategoryRoutes = (app) => {
    router.get('/', jsonParser, asyncHandler(categoryController.getActiveCategories));
    router.post('/create', jsonParser, asyncHandler(categoryController.createCategory));

    app.use('/category', router);
}

export default initCategoryRoutes;