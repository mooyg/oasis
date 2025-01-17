import { config } from 'dotenv';
import path, { join } from 'path';
import ms from 'pretty-ms';
import next from 'next';
import * as log from './lib/log';
import { exit } from './lib/exit';
import { getServer } from './lib/getServer';

config({ path: join(__dirname, '../../.env') });

if (process.env.API_MODE === 'local') {
  config({ path: join(__dirname, '../../../api/.env') });
}

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: require('../../next.config.js') });
const handle = app.getRequestHandler();
const start = Date.now();

(async () => {
  const server = await getServer(process.env.API_MODE as string);
  const PORT = Number(process.env.PORT) || 3000;

  if (!server) {
    exit(1);
  }

  server.all('*', (req, res) => {
    return handle(req, res as any);
  });

  app.prepare().then(() => {
    try {
      server.listen(PORT, (err?: any) => {
        if (err) throw err;
        log.ready(
          `ready in ${ms(Date.now() - start)} on http://localhost:${PORT}`
        );
      });
    } catch (err) {
      log.error(err);
    }
  });
})();
