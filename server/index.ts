#!/usr/bin/env node

import app from './app';
import * as debug from 'debug';
import * as http from 'http';

const debuggerFn: debug.IDebugger = debug('main-server:server');

const port: string = process.env.SERVER_PORT || '3001';
app.set('port', port);

const server: http.Server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      /* tslint:disable:no-console */
      console.error(port + ' requires elevated privileges');
      /* tslint:enable:no-console */
      process.exit(1);
      break;
    case 'EADDRINUSE':
      /* tslint:disable:no-console */
      console.error(port + ' is already in use');
      /* tslint:enable:no-console */
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  debuggerFn('Listening on ' + server.address());
}
