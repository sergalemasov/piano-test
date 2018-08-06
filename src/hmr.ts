import { NgModuleRef, ApplicationRef, ComponentRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';

export const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
    let ngModule: NgModuleRef<any>;

    module.hot.accept();

    bootstrap().then((mod: NgModuleRef<any>) => ngModule = mod);

    module.hot.dispose(() => {
        const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
        const elements = appRef.components.map((c: ComponentRef<any>) => c.location.nativeElement);
        const makeVisible = createNewHosts(elements);

        // This error handling is required as sometimes some components aren't destroyed properly but an exception
        // is not thrown.
        try {
            ngModule.destroy();
        } catch (e) {
            /* tslint:disable:no-console */
            console.error(e);
            /* tslint:enable:no-console */
            throw(e);
        }

        makeVisible();
    });
};
