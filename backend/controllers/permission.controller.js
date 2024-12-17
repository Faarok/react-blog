import permissionDb from '../databases/permission.db.js';
import { tools, permissionRange } from '../functions.js';
import fs from 'fs';

const permissionController = {
    createPermission: async (req, res) => {
        let { scope, method, range } = req.body;

        if(tools.isStringEmpty(scope))
            return res.status(400).json({ error: 'Empty permission scope' });

        if(!fs.existsSync(`./controllers/${scope}.controller.js`))
            return res.status(400).json({ error: 'Invalid scope' });

        if(tools.isStringEmpty(method))
            return res.status(400).json({ error: 'Empty permission method' });

        if(tools.isStringEmpty(range))
            return res.status(400).json({ error: 'Empty permission range' });

        if(!Object.values(permissionRange).includes(range))
            return res.status(400).json({ error: 'Invalid range' });

        let selectData = [
            { column: 'permission_scope:=', value: scope },
            { logic: 'AND' },
            { column: 'permission_method:=', value: method },
            { logic: 'AND' },
            { column: 'permission_range:=', value: range }
        ];

        let permissionExist = await permissionDb.getPermissionByFilter(selectData);
        if(permissionExist.error)
            return res.status(400).json({ error: permissionExist.error });

        if(permissionExist.length !== 0)
            return res.status(409).json({ error: 'Permission already exist' });

        let insertData = {
            columns: ['permission_scope', 'permission_method', 'permission_range'],
            values: [
                [scope, method, range]
            ]
        };

        let insertResponse = await permissionDb.createPermission(insertData);
        let responseError = insertResponse.error;

        if(responseError)
            return res.status(400).json({ error: responseError });

        return res.status(201).json({ success: 'Permission created' });
    }
}

export default permissionController;