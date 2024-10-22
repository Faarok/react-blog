import db from './init.db.js';

const tableName = 'category';

const poolQuery = (query, data = []) => db.pool.promise().execute(query, data);

const categoryDatabase = {
    createCategory: async (category_name, fk_category_parent) => {
        try
        {
            let query = 'INSERT INTO ' + tableName + '(category_name, fk_category_parent, category_state, category_created) VALUES (?, ?, ?, NOW())';
            let [results] = await poolQuery(query, [category_name, fk_category_parent, db.ACTIVE]);
            return results;
        }
        catch (err)
        {
            console.error('Erreur lors de l\'insertion :', err);
            return { error: err.message };
        }
    },
    checkExistingCategory: async (category_name) => {
        try
        {
            let query = 'SELECT category_name FROM ' + tableName + ' WHERE category_name = ? LIMIT 1';
            let [results] = await poolQuery(query, [category_name]);
            return results;
        }
        catch (err)
        {
            console.error('Erreur lors de la sélection :', err);
            return { error: err.message };
        }
    },
    getCategoryById: async(category_id) => {
        try
        {
            let query = 'SELECT category_name FROM ' + tableName + ' WHERE category_id = ?';
            let [results] = await poolQuery(query, [category_id]);
            return results;
        }
        catch (err)
        {
            console.error('Erreur lors de la sélection :', err);
            return { error: err.message };
        }
    },
    getActiveCategories: async() => {
        let query = 'SELECT * FROM ' + tableName + ' WHERE category_state = ?';
        let [results] = await poolQuery(query, [db.ACTIVE]);
        return results;
    }
}

export default categoryDatabase;