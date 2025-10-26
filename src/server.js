import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFountHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUi from 'swagger-ui-express';
import path from 'node:path';
import * as fs from 'node:fs';

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json'), 'utf-8'),
);

const PORT = Number(getEnvVar('PORT'));

export const setupServer = () => {
  const app = express();
  app.use(cookieParser());

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(errorHandler);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENT));

  app.use(notFountHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
