import articleDb from '../databases/article.db.js';

const articleController = {
    readAll: () => {
        try
        {
            let articles = articleDb.readAll();
            console.log(articles);
        }
        catch (error)
        {
            console.error(error);
        }
    },
    create: (name, content, category) => {
        try
        {

        }
        catch (error)
        {
            console.error(error);
        }
    }
}

export default articleController;