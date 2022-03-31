import { config } from '@keystone-6/core';
import { BaseKeystoneTypeInfo, DatabaseConfig } from '@keystone-6/core/types';

import 'dotenv/config';
import e from 'express';

import session from 'express-session';

export const cloudinary = {
  cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  apiKey: `${process.env.CLOUDINARY_KEY}`,
  apiSecret: `${process.env.CLOUDINARY_SECRET}`,
  folder: 'tngvi',
};
import * as lists from './admin/schema';

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
      state: true,
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

      DB().userModel.findOneAndUpdate(
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
          console.log(err, user);
          return done(err, user);
        }
      );
    }
  );
  /**
   * Google oauth2/passport config
   */
  passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    console.log(user);
    done(null, user);
  });
  passport.deserializeUser(
    (user: any, done: (arg0: null, arg1: any) => void) => {
      console.log('de', user);
      done(null, user);
    }
  );

  passport.use(strategy);

  // // Support json encoded bodies
  // router.use(bodyParser.json());

  // // Support encoded bodies
  // router.use(
  //   bodyParser.urlencoded({
  //     extended: true,
  //   })
  // );

  // // Set router to use passport
  // router.use(passport.initialize());
  // router.use(passport.session());

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
            return;
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
            scope: ['profile', 'openid', 'email'],
          })
        );

        app.get('/cms/callback', (req, res, next) => {
          try {
            p.authenticate(
              'google',
              (error: any, user: { permissions: any }, info: any) => {
                if (error) {
                  console.log('oauth err', error);
                  res.status(401).send(error);
                  return;
                }
                if (!user) {
                  console.log('info', info);
                  res.status(401).send(info);
                  return;
                }

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
          console.log('send to login', req.session);
          if (
            req.path !== '/api/__keystone_api_build' &&
            (!req.session.passport || !req.session.passport.user)
          ) {
            // Cache URL to bring user to after auth
            req.session.redirectTo = req.originalUrl;
            // if (req.session.redirectTo) res.redirect(req.session.redirectTo);
            // else {

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
