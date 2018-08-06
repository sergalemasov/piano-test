'use strict';

import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import { apiRouter } from '@srv-routes';
import {
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_NOT_FOUND
} from '@srv-const';

const app: express.Express = express();

app.use(logger('dev'));
app.use(bodyParser.json());

// CORS
// app.use(function(req: express.Request, res: express.Response, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Credentials', 'true');

//   // intercept OPTIONS method
//   if ('OPTIONS' === req.method) {
//     res.status(200).end();
//   } else {
//     next();
//   }
// });

app.use('/api', apiRouter);

app.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
  const err: any = <any>new Error('Not Found');
  err.status = HTTP_NOT_FOUND;
  next(err);
});

app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status || HTTP_INTERNAL_SERVER_ERROR);

  if (req.app.get('env') === 'development') {
    res.json({
      error: {
        status: err.status,
        message: err.message,
        stackTraceList: ((stack: string) => {
          if (stack) {
            return stack.split('\n').map((stackLine: string) => {
              return stackLine.trim();
            });
          }
        })(err.stack)
      }
    });
  } else {
    res.end();
  }
});

export default app;
