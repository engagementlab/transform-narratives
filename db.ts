/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 202
 * @author Johnny Richardson
 * 
 */

// Mongoose config w/ promise
// import {Mongoose} from 'mongoose';

import { Schema, model, connect, modelNames, models } from 'mongoose';

let dbAddress: string = process.env.MONGO_ADMIN_URI || 'mongodb://localhost:27017/elab-admin';

const userSchema = new Schema({
    googleId: {
        type: String,
    },
    name: {
        type: String,
        isRequired: true,
    },
    email: {
        type: String,
        isRequired: true,
        unique: true,
        index: true,
    },
    permissions: {
        type: Array,
    },
    isAdmin: {
        type: Boolean,
    },
    lastLogin: {
        type: Date,
    },
    photo: {        
        type: String,
    },
});


/**
 * Create DB connection for admin database, which contains links collection.
 * @name DB
 * @module
 */
module.exports = () => {
    let userModel = null;
    if(modelNames().length === 0) {
        const conn = connect(dbAddress);
        userModel = model('User', userSchema);
    }
    else
        userModel = models['User']
    return userModel;
};