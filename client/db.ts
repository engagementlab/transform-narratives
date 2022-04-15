/**
 *
 * Developed by Engagement Lab, 2022
 * @author Johnny Richardson
 *
 */

import {
  Schema,
  model,
  models,
  modelNames,
  connect,
  connection,
} from 'mongoose';

let dbAddress: string =
  process.env.MONGO_ADMIN_URI || 'mongodb://localhost:27017/elab-admin';

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
 * Create DB connection for admin database
 * @name DB
 * @module
 */
module.exports = () => {
  let userModel = null;
  if (modelNames().length === 0) {
    connect(dbAddress);
    userModel = model('User', userSchema);
  } else userModel = models['User'];
  return {
    connection,
    userModel,
  };
};
