import bodyParser from "body-parser";
import { Router } from "express";
import permissionController from "../controllers/permission.controller";

const jsonParser = bodyParser.json();

const initPermissionRoute = function(app) {
    const router = Router();

    router.post('/create', jsonParser, permissionController.createPermission);

    app.use('/permission', router);
}

export default initPermissionRoute;