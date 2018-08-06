import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { joinPaths } from '@utils';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalApiService {
  private apiPrefix = '/api';

  constructor(private restService: RestService) {}

  public signIn() {
    return this.restService.get(joinPaths(this.apiPrefix, 'sign-in'));
  }

  public signUp() {
    return Observable.of(null);
  }
}
