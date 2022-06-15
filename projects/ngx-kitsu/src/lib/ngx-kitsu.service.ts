import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { camel, deserialise, error, kebab, query, serialise, snake, splitModel } from 'kitsu-core'
import { map, Observable } from 'rxjs';
import { NGX_KITSU_DEFAULT_CONFIGURATION } from './tokens';

@Injectable()
export class NgxKitsuService {

  constructor(
    private http: HttpClient,
    @Inject(NGX_KITSU_DEFAULT_CONFIGURATION) private config: NgxKitsuConfiguration
  ) { }

  public get baseURL() {
    return this.config.baseURL!
  }

  public requestURL(stub: string): string {
    return this.baseURL + (this.baseURL.endsWith("/") ? "" : "/") + stub;
  }

  public get timeout() {
    return this.config.timeout
  }

  public get headers() {
    return {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      ...this.config.headers
    }
  }


  public fetch<T = {}>(model: string, options: RequestOptions = {}): Observable<KitsuResponse<T>> {
    const headers = { ...this.headers, ...options.headers }
    const params = new HttpParams({fromString: query({ ...{}, ...options.params })});

    const [ res, id, relationship, subRelationship ] = model.split('/')
    let url = this.pluralize(this.resourceCaseTransform(res))
    if (id) url += `/${this.resourceCaseTransform(id)}`
    if (relationship) url += `/${this.resourceCaseTransform(relationship)}`
    if (subRelationship) url += `/${this.resourceCaseTransform(subRelationship)}`

    return this.http.get<{data: T}>(this.requestURL(url), { headers, params }).pipe(
      this.transformResponse(options)
    )
  }

  public update<T = {}>(model: string, body: Partial<T>, options: RequestOptions = {}): Observable<KitsuResponse<T>> {
    const headers = { ...this.headers, ...options.headers }
    const params = new HttpParams({fromString: query({ ...{}, ...options.params })});

    const [ resourceModel, url ] = splitModel(model, {
      resourceCase: (s: string) => this.resourceCaseTransform(s),
      pluralModel: (s: string) => this.pluralize(s)
    })

    const serialData = serialise(resourceModel, body, 'PATCH', {
      camelCaseTypes: (s: string) => this.typeCaseTransform(s),
      pluralTypes: (s: string) => this.pluralize(s)
    })

    return this.http.patch<{data: T}>(this.requestURL(url), serialData, { headers, params }).pipe(
      this.transformResponse(options)
    )
  }

  public create<T = {}>(model: string, body: Partial<T>, options: RequestOptions = {}): Observable<KitsuResponse<T>> {
    const headers = { ...this.headers, ...options.headers }
    const params = new HttpParams({fromString: query({ ...{}, ...options.params })});

    const [ resourceModel, url ] = splitModel(model, {
      resourceCase: (s: string) => this.resourceCaseTransform(s),
      pluralModel: (s: string) => this.pluralize(s)
    })

    const serialData = serialise(resourceModel, body, 'POST', {
      camelCaseTypes: (s: string) => this.typeCaseTransform(s),
      pluralTypes: (s: string) => this.pluralize(s)
    })

    return this.http.post<{data: T}>(this.requestURL(url), serialData, { headers, params }).pipe(
      this.transformResponse(options)
    )
  }

  public remove<T = {}>(model: string, id: any, options: RequestOptions = {}): Observable<void> {
    const headers = { ...this.headers, ...options.headers }
    const params = new HttpParams({fromString: query({ ...{}, ...options.params })});

    const [ _resourceModel, url ] = splitModel(model, {
      resourceCase: (s: string) => this.resourceCaseTransform(s),
      pluralModel: (s: string) => this.pluralize(s)
    })

    return this.http.delete<{data: T}>(this.requestURL(`${url}/${id}`), { headers, params }).pipe(
      this.transformResponse(options)
    )
  }

  public resourceCaseTransform(s: string): string {
    switch(this.config.resourceCase) {
      case 'kebab':
        return kebab(s)
      case 'snake':
        return snake(s)
      default: // 'none'
        return s
    }
  }

  public typeCaseTransform(s: string): string {
    if (!this.config.camelizeType) { return s; }

    return camel(s);
  }

  public pluralize(s: string): string {
    if (!this.config.pluralize) { return s; }

    return this.pluralizationRules[s] || s + 's';
  }

  public get pluralizationRules() {
    return this.config.pluralizationRules
  }

  private transformResponse(options: RequestOptions) {
    return map(res => {
      const select = options.select || this.config.defaultResponseSelector;
      if (select == 'response') { return res; }

      const response = deserialise(res);
      if (select == 'body') { return response; }

      return response[select]
    })
  }
}

export interface NgxKitsuConfiguration {
  baseURL: string;
  timeout: number;
  pluralize: boolean;
  camelizeType: boolean;
  pluralizationRules: { [model: string]: string };
  resourceCase: 'none' | 'snake' | 'kebab';
  headers: { [key: string]: string };
  defaultResponseSelector: ResponseSelector;
}

export interface RequestOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: any };
  select?: ResponseSelector;
}

export interface KitsuResponse<T> {
  data: T,
  meta?: any;
}

export type ResponseSelector = 'meta' | 'data' | 'body' | 'response';
