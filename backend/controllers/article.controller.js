import articleDb from '../databases/article.db.js';

const articleController = {
    createArticle: async (req, res) => {
        try
        {
            let { name, content, category } = req.body;

            if(typeof name === 'undefined' || !name || name.trim().length === 0)
                return res.status(400).json({ error: 'Missing article name' });

            if(typeof content === 'undefined' || !content || content.trim().length === 0)
                return res.status(400).json({ error: 'Missing article content' });

            if(typeof category === 'undefined' || !category || category.length === 0)
                return res.status(400).json({ error: 'Missing article category' });

            category = parseInt(category);
            if(!Number.isInteger(category) || category <= 0)
                return res.status(400).json({ error: 'Category ID must be a positive integer' });

            // TODO: Vérifier qu'aucune article n'existe avec le combo name + category
            let filters = [
                { column: 'article_name:=', value: name },
                { logic: 'AND' },
                { column: 'fk_category_id:=', value: category }
            ];

            let articleExist = await articleDb.getArticleByFilters(filters);

            return console.log('fin');


            return console.log(articleExist);

            // TODO: Créer l'article



            // let response = await articleDb

            return res.status(200).json({ message: 'Article created' });
        }
        catch(error)
        {
            console.error(error.stack);
            return res.status(400).send('Bad request');
        }
    }
}

export default articleController;