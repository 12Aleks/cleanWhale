import * as process from 'node:process';

export default () => ({
    mongo: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        db: process.env.DB_NAME,
        jwt_secret: process.env.JWT_SECRET,
    },
});