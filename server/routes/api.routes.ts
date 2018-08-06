'use strict';

import { Router, Request, Response, NextFunction } from 'express';
import { HTTP_OK } from '@srv-const';

const router: Router = Router();

router.get(
  '/sign-in',
  (_req: Request, res: Response, _next: NextFunction) => {
    res.statusCode = HTTP_OK;
    res.json({
      username: 'asd',
      password: '123'
    });
  }
);

export { router as apiRouter };
