'use strict';

import mongoose from "mongoose";

export const dbConnection = async() =>{
    try{
        mongoose.connection.on('error', ()=>{
            console.log('Mongo DB | Could not be connected to Mongo DB');
            mongoose.disconnect();
        })
        mongoose.connection.on('connecting', () =>{
            console.log('Mongo DB | Trying connect');
        })
        mongoose.connection.on('connected', () =>{
            console.log('Mongo DB | Connected to Mongo DB');
        })
        mongoose.connection.on('open', () =>{
            console.log('Mongo DB | Connected to the database');
        })
        mongoose.connection.on('reconnected', () =>{
            console.log('Mongo DB | reconected to the database');
        })
        mongoose.connection.on('disconnected', () =>{
            console.log('Mongo DB | Disconnected');
        })
        mongoose.connect(process.env.URI_MONGO,{
            serverSelectionTimeoutMS: 5000,
            maxPoolSize:50
        } );
    }  catch(error){
        console.log('Database connection failes', error);
    } 
}