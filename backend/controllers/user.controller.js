import userDb from '../databases/user.db.js';
import tools from '../functions.js';

const userController = {
    createUser: (req, res) => {
        let { name, firstname, mail, password, passwordConfirm } = req.body;

        if(tools.isStringEmpty(name))
            return res.status(400).json({ error: 'Name can\'t be empty' });

        if(tools.isStringEmpty(firstname))
            return res.status(400).json({ error: 'Firstname can\'t be empty' });

        if(!tools.validateEmail(mail))
            return res.status(400).json({ error: 'Mail is in an invalid format' });

        if(!tools.validatePassword(password))
            return res.status(400).json({ error: 'Password is invalid' });

        if(password !== passwordConfirm)
            return res.status(400).json({ error: 'Passwords must be identical' });

        // TODO: Requête SQL pour créer la donnée
        // TODO: Vérifier la donnée émise par l'insert

        return;
    }
}

export default userController;