import categoryDb from '../databases/category.db.js';

const categoryController = {
    createCategory: async (req, res) => {
        try
        {
            const { name, parent } = req.body;

            if(name.length < 0)
                return res.status(409).json({ message: 'Category name required' });

            let categoryExist = await categoryDb.checkExistingCategory(name);

            if(categoryExist.length > 0)
                return res.status(409).json({ message: 'Category already exist' });

            if(parent)
            {
                let checkParentId = await categoryDb.getCategoryById(parent);

                if(checkParentId.length == 0)
                    return res.status(400).json({ message: 'Category parent doesn\'t exist' });
            }

            let response = await categoryDb.createCategory(name, parent);
            let responseError = response.error;

            if(responseError)
                return res.status(400).json({ message: responseError });

            return res.status(200).json({ message: 'Category created', categoryId: response.insertId });
        }
        catch (err)
        {
            console.error(err.stack);
            return res.status(400).send('Bad request');
        }
    },
    getActiveCategories: async (req, res) => {
        try
        {
            let response = await categoryDb.getActiveCategories();
            let responseError = response.error;

            if(responseError)
                return res.status(500).json({ message: responseError });

            return response;
        }
        catch (err)
        {
            console.error(err.stack);
            return res.status(400).send('Bad request');
        }
    }
}

export default categoryController;