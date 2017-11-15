import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UtilsRequest {
  // private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  fix(url: string, options: any): Promise<any> {
    return this.performType('devFix', url, options);
  }

  multiple(url: string, options: any): Promise<any> {
    return this.performType('devMultiple', url, options);
  }

  toggle(url: string, options: any): Promise<any> {
    return this.performType('devToggle', url, options);
  }

  private performType(type: string, url: string, obj: any): Promise<any> {
    url = _.trim(url);

    if (!obj.__dev.environment.production) {
      return this[type](url, obj);
    } else {
      return this.prod(url, obj);
    }
  }

  private devFix(url: string): Promise<any> {
    return this.getData(url);
  }

  private devMultiple(url: string, obj: any): Promise<any> {
    return this.getData(url + '/' + obj.__dev.id);
  }

  private devToggle(url: string, obj: any): Promise<any> {
    return this.getData(`api/__Toggle/${Math.floor(Math.random() * 10) % 2}`);
  }

  private getData(url: string) {
    return this.http.get(url)
      .toPromise()
      .then(response => _.omit(response, ['id']))
      .catch(this.handleError);
  }

  private prod(url: string, obj: object): Promise<any> {
    obj = _.omit(obj, ['__dev']);

    return this.http.post(url, JSON.stringify(obj))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  public sort(obj: any, environment: object): object {
    //No parameters matching
    obj = obj ? obj : {
      requestCommand: '',
      responseCommand: '',
    }

    let __dev = {};
    if (obj) {
      if (obj.__dev) {
        __dev = obj.__dev;
      }
    }
    return {
      __dev: {
        environment,
        ...__dev,
      },
      ...(_.omit(obj, ['__dev'])),
    };
  }
}
