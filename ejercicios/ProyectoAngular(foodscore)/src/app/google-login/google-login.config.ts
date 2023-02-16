import { InjectionToken, Provider } from '@angular/core';
export const CLIENT_ID = new InjectionToken<string>('128023507324-eb7ettrnedtqa9etjs5snhnoj8hlrknr.apps.googleusercontent.com');

export function provideGoogleId(clientId: string): Provider {
    return { provide: CLIENT_ID, useValue: clientId };
}
