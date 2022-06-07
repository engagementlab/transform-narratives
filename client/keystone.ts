import { config } from '@keystone-6/core';
import { BaseKeystoneTypeInfo, DatabaseConfig } from '@keystone-6/core/types';
import axios from 'axios';

import 'dotenv/config';
import e from 'express';
import session from 'express-session';

import { v2 as cloudinary } from 'cloudinary';

import * as lists from './admin/schema';
const multer = require('multer');
const upload = multer();

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_KEY}`,
  api_secret: `${process.env.CLOUDINARY_SECRET}`,
  secure: true,
});

const bodyParser = require('body-parser');
const passport = require('passport');
const AuthStrategy = require('passport-google-oauth20').Strategy;
const MongoStore = require('connect-mongo')(session);
const DB = require('./db');
declare module 'express-serve-static-core' {
  interface Request {
    logIn: any;
  }
}

declare module 'express-session' {
  export interface SessionData {
    redirectTo: string;
    save: any;
    passport: {
      redirectTo: string;
      user: { [key: string]: any };
    };
  }
}
// const ciMode = process.env.NODE_ENV === 'ci';

// Fallback
let dbConfig: DatabaseConfig<BaseKeystoneTypeInfo> = {
  provider: 'sqlite',
  url: 'file:./app.db',
};
if (process.env.DB_URI) {
  dbConfig = {
    provider: 'postgresql',
    url: process.env.DB_URI,
  };
}

const Passport = () => {
  const strategy = new AuthStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK_URL,
      // state: true,
      // skipUserProfile: true,
    },
    (
      request: any,
      _accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) => {
      // Verify user allowed
      const email = profile.emails[0].value;

      try {
        DB().userModel.findOne(
          {
            email,
          },
          (err: any, user: any) => {
            if (err) {
              console.error(`Login error: ${err}`);
              return done(err);
            }
            if (!user) {
              console.error(
                `Login error: user not found for email ${profile.emails[0].value}`
              );
              return done(err);
            }
            // console.log(err, user);
            return done(err, user);
          }
        );
      } catch (err) {
        throw new Error(err as string);
      }
    }
  );
  /**
   * Google oauth2/passport config
   */
  passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    // console.log('user', user);
    done(null, user);
  });
  passport.deserializeUser(
    (user: any, done: (arg0: null, arg1: any) => void) => {
      // console.log('de', user);
      done(null, user);
    }
  );

  passport.use(strategy);

  return passport;
};

let ksConfig = {
  db: dbConfig,
  experimental: {
    generateNextGraphqlAPI: true,
    generateNodeAPI: true,
  },
  lists,
  server: {
    extendExpressApp: (app: e.Express) => {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      app.get('/prod-deploy', async (req, res, next) => {
        try {
          const response = await axios.get(
            `${process.env.DEPLOY_API_PATH}&name=transform-narratives`
          );
          res.status(200).send(response.data);
        } catch (err: any) {
          res.status(500).send(err.message);
        }
      });

      app.get('/media/get/:type', async (req, res) => {
        try {
          cloudinary.api.resources(
            { prefix: 'tngvi', resource_type: 'image', type: req.params.type },
            (e, response) => res.status(200).send(response)
          );
        } catch (err: any) {
          res.status(500).send(err);
        }
      });

      app.post('/media/upload', upload.none(), async (req, res) => {
        try {
          const response = await cloudinary.uploader.upload(req.body.img, {
            folder: 'tngvi',
          });
          res.status(200).send(response);
        } catch (err: any) {
          console.error(err);
          res.status(500).send(err);
        }
      });

      if (process.env.ENABLE_AUTH === 'true') {
        let p = Passport();
        // Session store (mongostore for prod)
        if (process.env.NODE_ENV === 'development') {
          app.use(
            session({
              secret: process.env.SESSION_COOKIE || 'just-dev',
              resave: true,
              saveUninitialized: true,
            })
          );
        } else {
          const mongooseConnection = DB().connection;
          if (!process.env.SESSION_COOKIE) {
            throw new Error('Need SESSION_COOKIE in .env!');
          }
          app.use(
            session({
              saveUninitialized: false,
              resave: false,
              secret: process.env.SESSION_COOKIE,
              store: new MongoStore({
                mongooseConnection,
              }),
            })
          );
        }
        app.get(
          '/cms/login',
          p.authenticate('google', {
            scope: ['openid', 'email'],
          })
        );

        app.get('/cms/callback', (req, res, next) => {
          try {
            p.authenticate(
              'google',
              (error: any, user: { permissions: any }, info: any) => {
                if (!user) return;

                // Log user in
                req.logIn(user, (logInErr: any) => {
                  if (logInErr) {
                    res.status(500).send(logInErr);
                    return logInErr;
                  }

                  // Explicitly save the session before redirecting!
                  req.session.save(() => {
                    res.redirect(req.session.redirectTo || '/');
                  });
                  return null;
                });
              }
            )(req, res);
          } catch (e: any) {
            if (e) throw new Error(e);
          }
        });

        app.use(p.initialize());
        app.use(p.session());
        app.use((req, res, next) => {
          // Ignore API path
          if (
            req.path !== '/api/__keystone_api_build' &&
            (!req.session.passport || !req.session.passport.user)
          ) {
            // console.log(req.session.redirectTo);
            // Cache URL to bring user to after auth
            req.session.redirectTo = req.originalUrl;
            // if (req.session.redirectTo) res.redirect(req.session.redirectTo);
            // else {
            console.log('redirecting to ' + req.originalUrl);
            res.redirect('/cms/login');
            // }
          } else if (req.session.passport && req.session.passport.user.isAdmin)
            next();
        });
      }
    },
  },
};

export default (() => {
  return config(ksConfig);
})();
