import bodyParser from 'body-parser';
import { Router } from 'express';
import roleController from '../controllers/role.controller.js';
import asyncHandler from '../middlewares/asyncHandler.middlewares.js';

const jsonParser = bodyParser.json();

const initRoleRoutes = function(app) {
    const router = Router();

    router.post('/create', jsonParser, asyncHandler(roleController.createRole));
    router.post('/set', jsonParser, asyncHandler(roleController.setPermissionsToRole));

    app.use('/role', router);
}

export default initRoleRoutes;