import bodyParser from "body-parser";
import { Router } from "express";
import permissionController from "../controllers/permission.controller.js";

const jsonParser = bodyParser.json();

const initPermissionRoutes = function(app) {
    const router = Router();

    router.post('/create', jsonParser, asyncHandler(permissionController.createPermission));

    app.use('/permission', router);
}

export default initPermissionRoutes;