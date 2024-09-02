import dotenv from 'dotenv'
import { DB_NAME } from '../constants.js';

// Config File stores all the configuration related variables of the backend
const config = {
    token:{
        accessToken:{
            privateKey:process.env.ACCESS_TOKEN_PRIVATE_KEY,
            expiry:process.env.ACCESS_TOKEN_EXPIRY,
        },
        refreshToken:{
            privateKey:process.env.REFRESH_TOKEN_PRIVATE_KEY,
            expiry:process.env.REFRESH_TOKEN_EXPIRY,
        },
    },
    database:{
        mongoDBConnectionString:process.env.MONGO_DB_CONNECTION_STRING,
        databaseName:DB_NAME,
    },
    app:{
        port:process.env.PORT || 8000,
        corsOrigin:process.env.CORS_ORIGIN || "*",
    }
}

export default config;