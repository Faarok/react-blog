import db from './init.db.js';

const articleDb = {
    tableName: 'article',
    createArticle: async function (article_name, article_content, fk_category_id) {

    },
    getArticleByFilters: async function (filters) {
        let queryBuild = db.queryBuilder.select(this.tableName).where(filters);
        let data = queryBuild.values;
        let [results] = await db.poolQuery(queryBuild.build(), data);
        return results;
    }
}

export default articleDb;