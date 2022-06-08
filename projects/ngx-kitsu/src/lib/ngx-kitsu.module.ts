import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxKitsuConfiguration, NgxKitsuService } from './ngx-kitsu.service';
import { NGX_KITSU_DEFAULT_CONFIGURATION } from './tokens';

export const DEFAULT_KITSU_CONFIGURATION: NgxKitsuConfiguration = {
  baseURL: '/api',
  timeout: 30000,
  pluralize: true,
  camelizeType: false,
  pluralizationRules: {},
  resourceCase: 'none',
  headers: {},
  defaultResponseSelector: 'body',
}

@NgModule({
  providers: [
    NgxKitsuService,
    {
      provide: NGX_KITSU_DEFAULT_CONFIGURATION,
      useValue: DEFAULT_KITSU_CONFIGURATION
    }
  ]
})
export class NgxKitsuModule {
  static forRoot(config: Partial<NgxKitsuConfiguration>): ModuleWithProviders<NgxKitsuModule> {
    return {
      ngModule: NgxKitsuModule,
      providers: [
        { provide: NGX_KITSU_DEFAULT_CONFIGURATION, useValue: { ...DEFAULT_KITSU_CONFIGURATION, ...config } }
      ]
    }
  }
}
