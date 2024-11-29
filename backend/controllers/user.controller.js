import argon2 from 'argon2';
import userDb from '../databases/user.db.js';
import { tools, dataState } from '../functions.js';

const userController = {
    createUser: async (req, res) => {
        try
        {
            let { name, firstname, mail, password, passwordConfirm } = req.body;

            if(tools.isStringEmpty(name))
                return res.status(400).json({ error: 'Name can\'t be empty' });

            name = name.toUpperCase();

            if(tools.isStringEmpty(firstname))
                return res.status(400).json({ error: 'Firstname can\'t be empty' });

            firstname = firstname.toLowerCase();
            firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);

            if(!tools.validateEmail(mail))
                return res.status(400).json({ error: 'Mail is in an invalid format' });

            if(!tools.validatePassword(password))
            {
                if(password.length < 8 || password.length > 32)
                    return res.status(400).json({ error: 'Password must contains 8 to 32 characters.' });
                else
                    return res.status(400).json({ error: 'Password must contains lowercase, uppercase, special char and number.' });
            }

            if(password !== passwordConfirm)
                return res.status(400).json({ error: 'Passwords must be identical' });

            let hashedPassword = await argon2.hash(password);

            let whereUserData = [
                { column: 'user_mail:=', value: mail },
                { logic: 'AND' },
                { column: 'user_state:!=', value: dataState.DELETED }
            ];

            let userExist = await userDb.getUserByFilter(whereUserData);
            if(userExist.length !== 0)
                return res.status(409).json({ error: 'Mail already used' });

            let insertData = {
                columns: ['user_name', 'user_firstname', 'user_mail', 'user_password', 'user_state', 'user_date_in'],
                values: [
                    [name, firstname, mail, hashedPassword, dataState.ACTIVE, 'sql:NOW']
                ]
            };

            let response = await userDb.createUser(insertData);
            let responseError = response.error;

            if(responseError)
                return res.status(400).json({ message: responseError });

            if(response.affectedRows !== 1)
                return res.status(409).json({ error: 'User not created '});

            return res.status(201).json({ message: 'User created' });
        }
        catch(error)
        {
            console.error(error.stack);
            return res.status(400).send('Bad request');
        }
    }
}

export default userController;