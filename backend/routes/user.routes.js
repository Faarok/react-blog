import { Router } from 'express';
import bodyParser from 'body-parser';
import userController from '../controllers/user.controller.js';
import asyncHandler from '../middlewares/asyncHandler.middlewares.js';

const jsonParser = bodyParser.json();
const router = Router();

const initUserRoutes = (app) => {
    router.post('/create', jsonParser, asyncHandler(userController.createUser));

    app.use('/user', router);
}

export default initUserRoutes;