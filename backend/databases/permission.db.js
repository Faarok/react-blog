import db from './init.db.js';

const permissionDb = {
    tableName: 'permission',

    createPermission: async function(permissionData) {
        let builder = db.queryBuilder.insert(this.tableName, permissionData).build();
        let [results] = await db.poolQuery(builder.query, builder.values);
        return results;
    },
    getPermissionByFilter: async function(selectData) {
        let builder = db.queryBuilder.select(this.tableName).where(selectData).build();
        let [results] = await db.poolQuery(builder.query, builder.values);
        return results;
    }
}

export default permissionDb;