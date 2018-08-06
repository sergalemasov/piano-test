import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import {
  NavigationService,
  RestService,
  LocalApiService
} from '@services';

import {
  AuthGuard
} from '@guards';

const coreComponents = [
  HeaderComponent,
  FooterComponent
];

const coreProviders = [
  NavigationService,
  RestService,
  LocalApiService,
  AuthGuard
];

@NgModule({
  declarations: [
    ...coreComponents
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ...coreProviders
  ],
  exports: [
    ...coreComponents
  ]
})
export class CoreModule {
}
