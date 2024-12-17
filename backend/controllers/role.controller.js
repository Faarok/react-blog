import permissionDb from '../databases/permission.db.js';
import roleDb from '../databases/role.db.js';
import rolePermissionDb from '../databases/role_permission.db.js';
import { tools } from '../functions.js';

const roleController = {
    createRole: async function(req, res) {
        let { name } = req.body;

        if(tools.isStringEmpty(name))
            return res.status(400).json({ error: 'Empty role name' });

        name = name.trim();

        let insertData = {
            columns: ['role_name'],
            values: [
                [name]
            ]
        };

        let createResponse = await roleDb.createRole(insertData);
        if(createResponse.error)
            return res.status(400).json({ error: createResponse.error });

        return res.status(200).json({ success: 'Role created' });
    },
    setPermissionsToRole: async function(req, res) {
        const { role, permissions } = req.body;

        if(!tools.isNumberInt(role))
            return res.status(400).json({ error: 'Role must be an integer' });

        if(tools.isArrayEmpty(permissions))
            return res.status(400).json({ error: 'Empty permissions' });

        let roleExist = await roleDb.getRoleByFilters([
            { column: 'role_id:=', value: role }
        ]);

        if(tools.isEmpty(roleExist))
        {
            tools.log({
                error: 'Role not found: unkown ID',
                missing_id: role
            }, 'role', 'error');

            return res.status(404).json({
                error: 'Role not found: unkown ID',
                missing_id: role
            });
        }

        let permissionsExist = await permissionDb.getPermissionByFilter([
            { column: 'permission_id:IN', value: permissions }
        ]);

        let foundIds = permissionsExist.map(perm => perm.permission_id);
        let missingIds = permissions.filter(id => !foundIds.includes(id));

        if(!tools.isArrayEmpty(missingIds))
        {
            tools.log({
                error: 'Permission(s) not found: unknown ID(s)',
                missing_ids: missingIds
            }, 'permission', 'error');

            return res.status(400).json({
                error: 'Permission(s) not found: unknown ID(s)',
                missing_ids: missingIds
            });
        }

        let insertData = {
            columns: ['fk_role_id', 'fk_permission_id'],
            values: []
        };

        for(const perm of permissions)
        {
            let rowExist = await rolePermissionDb.getPermissionByRole([
                { column: 'fk_role_id:=', value: role },
                { logic: 'AND' },
                { column: 'fk_permission_id:=', value: perm }
            ]);

            if(tools.isArrayEmpty(rowExist))
                insertData.values.push([role, perm]);
        };

        if(tools.isArrayEmpty(insertData.values))
        {
            tools.log({
                error: 'Permissions already allocated to the role',
                role_id: role,
                permissions_ids: permissions
            }, 'permission_role', 'error');

            return res.status(409).json({
                error: 'Permissions already allocated to the role',
                role_id: role,
                permissions_ids: permissions
            });
        }

        await rolePermissionDb.createRolePermission(insertData);
        return res.status(201).json({ message: 'Permissions assigned to the role' });
    }
}

export default roleController;