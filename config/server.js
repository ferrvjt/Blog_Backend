'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {dbConnection} from './mongo.js';
import limiter from '../src/middleware/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js'

const middlewares = (app)=>{
    app.use(express.urlencoded({extended:false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use("/opinionSystem/v1/auth", authRoutes);
    app.use("/opinionSystem/v1/user", userRoutes);
}

const conectarDB = async()=>{
    try {
        await dbConnection();
        console.log('Conexion a la base de datos exitosa');
    } catch (error) {
        console.error('Error conectando a la base de datos',error);
        process.exit(1);
    }
}

export const initServer= async()=>{
    const app = express();
    const port = process.env.PORT || 3005;

    try {
        app.listen(port);
        middlewares(app);
        conectarDB();
        routes(app);
        console.log(`Server running on port ${port}`)
    } catch (e) {
        console.log(`Server init failed: ${e}`)
    }
}