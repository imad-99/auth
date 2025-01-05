import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {AuthInterceptor, AuthInterceptorConfig} from './interceptor/auth.interceptor';
import {KeycloakAuthService, KeycloakConfig} from './service/keycloak-auth.service';
import {AuthService} from './service/auth.service';

export function provideKeycloakAuth(authInterceptorConfig: AuthInterceptorConfig, keycloakConfig: KeycloakConfig): EnvironmentProviders {
  const authService: AuthService = new KeycloakAuthService(keycloakConfig)
  const authInterceptor: AuthInterceptor = new AuthInterceptor(authInterceptorConfig, authService)
  return makeEnvironmentProviders([
    {
      provide: AuthService,
      useValue: authService
    },
    {
      provide: AuthInterceptor,
      useValue: authInterceptor
    }
  ])
}
