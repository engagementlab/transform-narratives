/**
 *
 * Developed by Engagement Lab, 2022
 * @author Johnny Richardson
 *
 */

import path from 'path';
import fs from 'fs';
import {
  createSystem,
  createExpressServer,
  createAdminUIMiddleware,
  initConfig,
} from '@keystone-6/core/system/dist/keystone-6-core-system.cjs.js';
//  import { initConfig } from '../../lib/config/initConfig';
import { requirePrismaClient } from '@keystone-6/core/artifacts/dist/keystone-6-core-artifacts.cjs.js';
//  import { ExitError, getAdminPath } from '../utils';

export default (async () => {
  console.log('✨ Starting Keystone');

  // This is the compiled version of the configuration which was generated during the build step.
  // See reexportKeystoneConfig().
  const apiFile = path.join(
    process.cwd(),
    '.keystone/admin/.next/server/pages/api/__keystone_api_build.js'
  );
  if (!fs.existsSync(apiFile)) {
    console.log('🚨 keystone build must be run before running keystone start');
    throw new Error('run build');
  }
  // webpack will make modules that import Node ESM externals(which must be loaded with dynamic import)
  // export a promise that resolves to the actual export so yeah, we need to await a require call
  const config = initConfig((await require(apiFile)).config);
  const { getKeystone, graphQLSchema } = createSystem(config);

  const prismaClient = requirePrismaClient(process.cwd());

  const keystone = getKeystone(prismaClient);

  console.log('✨ Connecting to the database');
  await keystone.connect();

  console.log('✨ Creating server');
  const { expressServer, httpServer } = await createExpressServer(
    config,
    graphQLSchema,
    keystone.createContext
  );
  console.log(`✅ GraphQL API ready`);
  if (!config.ui?.isDisabled) {
    console.log('✨ Preparing Admin UI Next.js app');
    expressServer.use(
      await createAdminUIMiddleware(
        config,
        keystone.createContext,
        false,
        path.join(process.cwd(), '.keystone/admin')
      )
    );
    console.log(`✅ Admin UI ready`);
  }

  const port = config.server?.port || process.env.PORT || 3000;
  httpServer.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`⭐️ Server Ready on http://localhost:${port}`);
  });
})();
