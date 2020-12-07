import { isPlatform } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { ConsoleLogObserver, AuthService, DefaultBrowser } from 'ionic-appauth';
import { CordovaBrowser, CordovaRequestor, CordovaSecureStorage } from 'ionic-appauth/lib/cordova';
import { CapacitorStorage } from 'ionic-appauth/lib/capacitor';
import { AxiosRequestor } from "./AxiosRequestor";

const { App } = Plugins;

export class Auth {

  private static authService : AuthService | undefined;

  private static buildAuthInstance() {
    const authService = new AuthService(isPlatform('cordova') ? new CordovaBrowser() : new DefaultBrowser(),
                                        isPlatform('cordova') ? new CordovaSecureStorage() : new CapacitorStorage(),
                                        isPlatform('cordova') ? new CordovaRequestor() : new AxiosRequestor());
    authService.authConfig = {
      client_id: process.env.REACT_APP_CLIENT_ID || '',
      server_host: process.env.REACT_APP_ISSUER || '',
      redirect_url: (isPlatform('capacitor') ? (process.env.REACT_APP_SCHEME || '') : window.location.origin) + '/callback',
      end_session_redirect_url: (isPlatform('capacitor') ? (process.env.REACT_APP_SCHEME || '') : window.location.origin) + '/logout',
      scopes: isPlatform('capacitor') ? 'openid profile offline_access' : 'openid profile',
      pkce: true              
    }

    if (isPlatform('capacitor')) {
      App.addListener('appUrlOpen', (data: any) => {
        if (data.url != undefined) {
          authService.authorizationCallback(data.url);
        }
      });
    }

    authService.addActionObserver(new ConsoleLogObserver());
    return authService;
  }

  public static get Instance() : AuthService {
    if (!this.authService) {
      this.authService = this.buildAuthInstance();
    }

    return this.authService;
  }
}