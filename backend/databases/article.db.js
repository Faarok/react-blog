import db from './init.db.js';

const tableName = 'article';

const articleDb = {
    readAll: () => {
        let query = 'SELECT * FROM ' + tableName;
        let result = db.execute(query);

        return result[0] || false;
    }
}

export default articleDb;