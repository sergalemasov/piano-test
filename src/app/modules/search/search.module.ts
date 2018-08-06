import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './components/search/search.component';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule
  ],
  providers: [],
})
export class SearchModule {
}
