import articleDb from '../databases/article.db.js';

const articleController = {
    create: (req, res) => {
        try
        {
            let { name, content, category } = req.body;

            if(typeof name === 'undefined' || name.length == 0)
                return res.status(400).json({ error: 'Missing article name' });

            if(typeof content === 'undefined' || content.length == 0)
                return res.status(400).json({ error: 'Missing article content' });

            if(typeof category === 'undefined' || category.length == 0)
                return res.status(400).json({ error: 'Missing article category' });
            else if(!Number.isInteger(category))
                return res.status(400).json({ error: 'Category must be an ID' });

            // TODO:
            /**
             * - Vérifier qu'aucune article n'existe avec le combo name + category
             * - Créer l'article
             */

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