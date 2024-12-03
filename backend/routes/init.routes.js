import initArticleRoutes from './article.routes.js';
import initCategoryRoutes from './category.routes.js';
import initPermissionRoute from './permission.routes.js';
import initUserRoutes from './user.routes.js';

const initRoutes = (app) => {
    initArticleRoutes(app);
    initCategoryRoutes(app);
    initUserRoutes(app);
    initPermissionRoute(app);
};

export default initRoutes;