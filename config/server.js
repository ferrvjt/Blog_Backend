'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {dbConnection} from './mongo.js';
import limiter from '../src/middleware/validar-cant-peticiones.js';
import courseRoutes from '../src/courses/course.routes.js'
import postRoutes from '../src/posts/post.routes.js'
import { createDefaultCourses } from '../src/courses/course.controller.js';

const middlewares = (app)=>{
    app.use(express.urlencoded({extended:false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use("/Blog/v1/course", courseRoutes);
    app.use("/Blog/v1/post", postRoutes);
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
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        createDefaultCourses();
        console.log(`Server running on port ${port}`)
    } catch (e) {
        console.log(`Server init failed: ${e.message}`)
    }
}