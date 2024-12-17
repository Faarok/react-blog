import initArticleRoutes from './article.routes.js';
import initCategoryRoutes from './category.routes.js';
import initPermissionRoutes from './permission.routes.js';
import initRoleRoutes from './role.routes.js';
import initUserRoutes from './user.routes.js';

const initRoutes = (app) => {
    initArticleRoutes(app);
    initCategoryRoutes(app);
    initUserRoutes(app);
    initPermissionRoutes(app);
    initRoleRoutes(app);
};

export default initRoutes;