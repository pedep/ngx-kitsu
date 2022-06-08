import { InjectionToken } from "@angular/core";
import { NgxKitsuConfiguration } from "./ngx-kitsu.service";

export const NGX_KITSU_DEFAULT_CONFIGURATION = new InjectionToken<NgxKitsuConfiguration>('NGX_KITSU_DEFAULT_CONFIGURATION');
