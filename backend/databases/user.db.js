import db from './init.db.js';

const userDb = {
    tableName: 'user',

    createUser: async function(userData) {
        let builder = db.queryBuilder.insert(this.tableName, userData).build();
        let [results] = await db.poolQuery(builder.query, builder.values);
        return results;
    },
    getUserByFilter: async function(userData) {
        let builder = db.queryBuilder.select(this.tableName).where(userData).build();
        let [results] = await db.poolQuery(builder.query, builder.values);
        return results;
    }
}

export default userDb;