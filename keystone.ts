import {
  config,
  list
} from '@keystone-6/core';
import {
  relationship,
  select,
  text
} from '@keystone-6/core/fields';
import {
  document
} from '@keystone-6/fields-document';

import { cloudinaryImage } from './admin/components/cloudinary';
import {
  Lists
} from '.keystone/types';
import { componentBlocks } from './admin/components/component-blocks';


import { AzureStorageConfig, azureStorageFile, azureStorageImage } from '@k6-contrib/fields-azure';
import 'dotenv/config';

import session from 'express-session';
import path from 'path';
import { video } from './admin/components/video';

const passport = require('passport');
const AuthStrategy = require('passport-google-oauth20').Strategy;
const MongoStore = require('connect-mongo')(session);
const DB = require('./db');

declare module "express-serve-static-core" {
  interface Request {
    logIn: any
  }
}

declare module 'express-session' {
  export interface SessionData {
    redirectTo: string;
    save: any;
    passport: {
      redirectTo: string;
      user: { [key: string]: any };
    }
  }
}

const azConfig: AzureStorageConfig = {
  azureStorageOptions: {
    account: process.env.AZURE_STORAGE_ACCOUNT,
    accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
    container: process.env.AZURE_STORAGE_CONTAINER,
  },
};

// const ciMode = process.env.NODE_ENV === 'ci'; 

export const cloudinary = {
  cloudName: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  apiKey: `${process.env.CLOUDINARY_KEY}`,
  apiSecret: `${process.env.CLOUDINARY_SECRET}`,
  folder: 'test',
};

const StudioImage: Lists.StudioImage = list({
  fields: {
    studioImages: relationship({ ref: 'Studio.photos', many: true }),
    image: cloudinaryImage({
      cloudinary,
      label: 'Source',
    }),
    imageName: text({validation: {
      isRequired: true
    }}),
    altText: text({validation: {
      isRequired: true
    }}),
  },
  ui: {
    isHidden: true,
    labelField: 'imageName',
    
  },
});
const Studio: Lists.Studio = list({
  fields: {
    title: text({
      validation: {
        isRequired: true
      }
    }),
    content: document({
      formatting: true,
      dividers: true,
      links: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
      ],
      ui: {
        views: path.join(process.cwd(), 'admin/components/component-blocks')
      },
      componentBlocks,

      relationships: {
        image: {
          kind: 'prop',
          listKey: 'StudioImage',
          selection: 'imageName altText image {publicUrlTransformed publicId}',
        },
      },
    }),
    photos: relationship({
      ref: 'StudioImage.studioImages',
      many: true,
      label: "Images (add here for use in 'Content' field)",
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'imageName', 'altText'],
        inlineCreate: { fields: ['image', 'imageName', 'altText'] },
        inlineEdit: { fields: ['image', 'imageName', 'altText'] },
      },
    }),
    // video: video({
    //   options: ['hi', 'hi2']}),
    // file: azureStorageFile({ azureStorageConfig: azConfig }),
  }
});

const Passport = () => {
  const strategy = new AuthStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK_URL,
      passReqToCallback: true,
    },
    (request: any, _accessToken: any, refreshToken: any, profile: {
      emails: {
        value: any;
      } [];photos: {
        value: any;
      } [];
    }, done: any) => {
      // Verify user allowed
      const email = profile.emails[0].value;
      // const photoUri = profile.photos ? profile.photos[0].value : undefined;

      DB().userModel.findOneAndUpdate({
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
          return done(err, user);
        }
      );
    }
  );
  /**
   * Google oauth2/passport config
   */
  passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user);
  });
  passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user);
  });

  passport.use(strategy);

  // Support json encoded bodies
  // router.use(bodyParser.json());

  // // Support encoded bodies
  // router.use(
  //   bodyParser.urlencoded({
  //     extended: true,
  //   })
  // );

  // Set router to use passport
  // router.use(passport.initialize());
  // router.use(passport.session());

  return passport;
}

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./app.db'
  },
  // experimental: {
  //   generateNextGraphqlAPI: true,
  //   generateNodeAPI: true,
  // },
  // ui: {
  //   getAdditionalFiles: [
  //     async () => [
  //       {
  //         mode: 'copy',
  //         inputPath: path.join(process.cwd(), 'admin', 'next.config.js'),
  //         outputPath: 'next.config.js',
  //       },
  //     ],
  //   ],
  // },
  // server: {
  //   extendExpressApp: (app) => {
  //     // let p = Passport();
  //       // Session store (mongostore for prod)
  //       if (process.env.NODE_ENV === 'development') {
  //         app.use(
  //           session({
  //             secret: process.env.SESSION_COOKIE || 'just-dev',
  //             resave: true,
  //             saveUninitialized: true,
  //           })
  //         );
  //       } else {
  //         const mongooseConnection = DB().connection;
  //         if(!process.env.SESSION_COOKIE){ 
  //             throw new Error('Need SESSION_COOKIE in .env!'); return;
  //         }
  //         app.use(
  //           session({
  //             saveUninitialized: false,
  //             resave: false,
  //             secret: process.env.SESSION_COOKIE,
  //             store: new MongoStore({
  //               mongooseConnection,
  //             }),
  //           })
  //         );
  //       }
  //     // app.get('/cms/login', p.authenticate('google', {
  //     //   scope: ['openid', 'email'],
  //     // }));

  //     // app.get('/cms/callback', (req, res, next) => {
  //     // try {
  //     //   p.authenticate('google', (error: any, user: { permissions: any; }, info: any) => {
  //     //     if (error) {
  //     //       console.log('oauth err', error)
  //     //       res.status(401).send(error);
  //     //       return;
  //     //     }
  //     //     if (!user) {
  //     //       console.log('info', info)
  //     //       res.status(401).send(info);
  //     //       return;
  //     //     }
          

  //     //     // Log user in
  //     //     req.logIn(user, (logInErr: any) => {
  //     //       if (logInErr) {
  //     //         res.status(500).send(logInErr);
  //     //         return logInErr;
  //     //       }

  //     //       // Explicitly save the session before redirecting!
  //     //       req.session.save(() => {
  //     //         res.redirect(req.session.redirectTo || '/');
  //     //         });
  //     //         return null;
  //     //       });
  //     //     })(req, res);
  //     //   } catch (e: any) {
  //     //     if(e) throw new Error(e);
  //     //   }
  //     // });
      
  //       // app.use(p.initialize())
  //       // app.use(p.session())
  //       app.use((req, res, next) => {
          
  //         // Ignore API path
  //         // if (req.path !== '/api/__keystone_api_build' && (!req.session.passport || !req.session.passport.user)) {   
  //         //   // Cache URL to bring user to after auth
  //         //   req.session.redirectTo = req.originalUrl;
  //         //   res.redirect('/cms/login');
  //         // }
  //         // else if(req.session.passport && req.session.passport.user.isAdmin) next();
  //       });
  //     },
  // },
  lists: {
    Studio,
    StudioImage
  },
});