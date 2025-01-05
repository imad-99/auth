import Keycloak from 'keycloak-js';
import {AuthService} from './auth.service';

export interface KeycloakAuthServiceConfig {
  url: string
  realm: string
  clientId: string
}

export class KeycloakAuthService extends AuthService {
  private keycloak: Keycloak

  constructor(keycloakAuthServiceConfig: KeycloakAuthServiceConfig) {
    super()
    this.keycloak = new Keycloak({
      url: keycloakAuthServiceConfig.url,
      realm: keycloakAuthServiceConfig.realm,
      clientId: keycloakAuthServiceConfig.clientId
    })
  }

  public async login(): Promise<void> {
    if (!this.keycloak.didInitialize) {
      const success: boolean = await this.keycloak.init({onLoad: 'login-required'});
      if (!success) {
        return undefined
      }
    } else {
      void this.keycloak.login()
    }
  }

  public async getAuthToken(): Promise<string | undefined> {
    if (!this.keycloak.didInitialize) {
      const success: boolean = await this.keycloak.init({onLoad: 'check-sso'})
      if (success) {
        // Refresh token if needed
        await this.keycloak.updateToken()
        return this.keycloak.token;
      }
    }
    return this.keycloak.token
  }

  public async logout(): Promise<void> {
    await this.keycloak.logout()
  }
}
