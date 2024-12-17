import db from "./init.db.js";

const tableName = 'role_permission';

const rolePermissionDb = {
    createRolePermission: async (insertData) => {
        let builder = db.queryBuilder.insert(tableName, insertData).build();
        console.log(builder.query, builder.values);
        return await db.poolQuery(builder.query, builder.values);
    },
    getPermissionByRole: async (selectData) => {
        let builder = db.queryBuilder.select(tableName).where(selectData).build();
        return (await db.poolQuery(builder.query, builder.values))[0];
    }
}

export default rolePermissionDb;