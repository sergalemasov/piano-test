import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponseBase,
  HttpResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { catchError } from 'rxjs/operators/catchError';
import 'rxjs/add/observable/of';
import { HTTP_NO_CONTENT, HTTP_OK } from '@const';
import { RestException } from '@exceptions';

interface IRequestOptions {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe: 'response';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType: 'blob';
  withCredentials?: boolean;
}

enum HttpMethod {
  GET = 'get',
  POST = 'post'
}

@Injectable()
export class RestService {
  constructor(private httpClient: HttpClient) {
  }

  public get(url: string, params?: HttpParams): Observable<any> {
    return this.sendRequest(HttpMethod.GET, url, params);
  }

  public post(url: string, content?: any): Observable<any> {
    return this.sendRequest(HttpMethod.POST, url, null, content);
  }

  private sendRequest(method: HttpMethod, url: string, params?: HttpParams, content?: any): Observable<any> {
    const responseMimeType: string = 'application/json';

    const methodsWithContent: HttpMethod[] = [
      HttpMethod.POST
    ];

    const methodsWithoutContent: HttpMethod[] = [
      HttpMethod.GET
    ];

    const options: IRequestOptions = {
      body: methodsWithContent.includes(method) && content ? JSON.stringify(content) : undefined,
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({
        'Content-Type': responseMimeType,
        'Accept': responseMimeType
      }),
      params: methodsWithoutContent.includes(method) && params ? params : undefined
    };

    return this.httpClient.request(method as string, url, options)
      .pipe(
        mergeMap((response: any) => this.processResponse(response)),
        catchError((response: any) => {
          if (response instanceof HttpResponseBase) {
            try {
              return this.processResponse(<any>response);
            } catch (e) {
              return <Observable<string | null>><any>Observable.throw(e);
            }
          } else {
            return <Observable<string | null>><any>Observable.throw(response);
          }
        })
      );
  }

  private processResponse(response: HttpResponseBase): Observable<any> {
    const status = response.status;

    let responseBlob: Blob;
    if (response instanceof HttpResponse) {
      responseBlob = response.body;
    } else if ((<any>response).error instanceof Blob) {
      responseBlob = (<any>response).error;
    }

    const headers: any = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        headers[key] = response.headers.get(key);
      }
    }

    if (status === HTTP_OK) {
      return this.blobToText(responseBlob)
        .pipe(
          mergeMap((responseText: string) => Observable.of(
            responseText === '' ? null : JSON.parse(responseText)
          ))
        );
    } else if (status !== HTTP_OK && status !== HTTP_NO_CONTENT) {
      return this.blobToText(responseBlob)
        .pipe(
          mergeMap((responseText: string) => Observable.throw(
            new RestException(
              status,
              responseText,
              headers
            )
          ))
        );
    }

    return Observable.of<any>(<any>null);
  }

  private blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: Observer<string>): () => void => {
      let reader: FileReader;

      if (!blob) {
        observer.next('');
        observer.complete();
      } else {
        reader = new FileReader();
        reader.onload = (event: ProgressEvent & { target: FileReader | null }): void => {
          observer.next(event.target.result);
          observer.complete();
        };
        reader.readAsText(blob);
      }

      const unsubscribe = () => {
        if (reader) {
          reader.onload = null;
        }
      };

      return unsubscribe;
    });
  }
}
