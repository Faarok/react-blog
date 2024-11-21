import { Router } from 'express';
import { json } from 'body-parser';
import userController from '../controllers/user.controller.js';

const jsonParser = json();
const router = Router();

const initUserRoutes = (app) => {
    router.post('/create', jsonParser, userController.createUser);

    app.use('/user', router);
}

export default initUserRoutes;