import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { hmrBootstrap } from './hmr';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const bootstrap = (): Promise<any> => platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {
        if (environment.production) {
            enableProdMode();
        }
    })
    .catch((err: Error) => {
        /* tslint:disable:no-console */
        console.error(err);
        /* tslint:enable:no-console */
    });

if (environment.hmr) {
    if (module['hot']) {
        hmrBootstrap(module, bootstrap);
    } else {
        /* tslint:disable:no-console */
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
        /* tslint:enable:no-console */
    }
} else {
    bootstrap();
}

