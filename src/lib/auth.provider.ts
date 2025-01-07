import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {AuthInterceptor, AuthInterceptorConfig} from './interceptor/auth.interceptor';
import {KeycloakAuthService, KeycloakAuthServiceConfig} from './service/keycloak-auth.service';
import {AuthService} from './service/auth.service';

interface InterceptorConfig {
  authInterceptorConfig: AuthInterceptorConfig;
}

interface KeycloakInterceptorConfig extends InterceptorConfig {
  keycloakAuthServiceConfig: KeycloakAuthServiceConfig;
}

export function provideKeycloakAuthInterceptor(keycloakInterceptorConfig: KeycloakInterceptorConfig): EnvironmentProviders {
  const authService: AuthService = new KeycloakAuthService(keycloakInterceptorConfig.keycloakAuthServiceConfig)
  const authInterceptor: AuthInterceptor = new AuthInterceptor(keycloakInterceptorConfig.authInterceptorConfig, authService);
  return createEnvironmentProviders(authInterceptor, authService)
}

export function provideAuthInterceptor(interceptorConfig: InterceptorConfig, authService: AuthService): EnvironmentProviders {
  const authInterceptor: AuthInterceptor = new AuthInterceptor(interceptorConfig.authInterceptorConfig, authService);
  return createEnvironmentProviders(authInterceptor, authService)
}

function createEnvironmentProviders(authInterceptor: AuthInterceptor, authService: AuthService): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AuthInterceptor,
      useValue: authInterceptor
    },
    {
      provide: AuthService,
      useValue: authService
    }
  ])
}
