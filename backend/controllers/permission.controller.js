import permissionDb from '../databases/permission.db.js';

const permissionController = {
    createPermission: async (req, res) => {
        let { label, slug } = req.body;

        return console.log(label, slug);
    }
}

export default permissionController;