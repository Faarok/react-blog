import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import moment from 'moment-timezone';

moment.tz.setDefault('Europe/Paris');
let expiryDate = moment().hour(1).toDate();

const initMiddlewares = (app) => {
    app.use(session({
        secret: process.env.APP_SECRET,
        name: 'session',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: true,
            expires: expiryDate
        }
    }));
    app.use(helmet());
    app.use(cors());
};

export default initMiddlewares;