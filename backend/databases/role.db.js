import db from './init.db.js';

const roleDb = {
    tableName: 'role',

    createRole: async function(roleData) {
        let builder = db.queryBuilder.insert(this.tableName, roleData).build();
        let [results] = await db.poolQuery(builder.query, builder.values);
        return results;
    },
    getRoleByFilters: async function(selectData) {
        let builder = db.queryBuilder.select(this.tableName).where(selectData).build();
        let [results] = await db.poolQuery(builder.query, builder.values);
        return results;
    }
}

export default roleDb;