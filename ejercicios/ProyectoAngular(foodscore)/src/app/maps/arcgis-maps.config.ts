import { InjectionToken, Provider } from '@angular/core';
export const ARCGIS_TOKEN = new InjectionToken<string>('client_id');

export function provideArcgisToken(token: string): Provider {
  return { provide: ARCGIS_TOKEN, useValue: token };
}
