import db from './init.db.js';

const tableName = 'article';

const articleDb = {
    createArticle: async (article_name, article_content, fk_category_id) => {

    },
    getActiveArticles: async () => {
        let query = 'SELECT * FROM ' + tableName + ' WHERE article_state = ?;';
        let [results] = await poolQuery(query, [db.ACTIVE]);
        return results;
    },
    getArticleByFilters: async (filters) => {
        console.log(db.queryBuilder.where(filters));
        console.log('articleByFilters');
    },
    getActiveArticleByNameAndCategory: async (article_name, fk_category_id) => {
        let query = 'SELECT * FROM ' + tableName + ' WHERE article_name = ? AND fk_category_id = ?;';
        let [results] = await poolQuery(query, [article_name, fk_category_id]);
        return results;
    }
}

export default articleDb;