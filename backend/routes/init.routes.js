import initArticleRoutes from './article.routes.js';
import initCategoryRoutes from './category.routes.js';

const initRoutes = (app) => {
    initArticleRoutes(app);
    initCategoryRoutes(app);
};

export default initRoutes;