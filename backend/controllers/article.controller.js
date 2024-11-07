import articleDb from '../databases/article.db.js';

const articleController = {
    createArticle: async (req, res) => {
        try
        {
            let { name, content, category } = req.body;

            if(typeof name === 'undefined' || name.length == 0)
                return res.status(400).json({ error: 'Missing article name' });
            else if(typeof content === 'undefined' || content.length == 0)
                return res.status(400).json({ error: 'Missing article content' });
            else if(typeof category === 'undefined' || category.length == 0)
                return res.status(400).json({ error: 'Missing article category' });
            else if(isNaN(category))
                return res.status(400).json({ error: 'Category ID must be a number' });
            else if(!Number.isInteger(category))
                category = parseInt(category, 10);

            // TODO:
            /**
             * - Vérifier qu'aucune article n'existe avec le combo name + category
             * - Créer l'article
             */

            let articleExist = await articleDb.getArticleByFilters(name, category);

            return console.log(articleExist);

            // let response = await articleDb

            return res.status(200).json({ message: 'Article created' });
        }
        catch (error)
        {
            console.error(err.stack);
            return res.status(400).send('Bad request');
        }
    }
}

export default articleController;