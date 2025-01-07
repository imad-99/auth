# Auth

## Overview
This Angular library provides an HTTP interceptor (AuthInterceptor) designed to handle authentication and authorization for HTTP requests. It integrates with a customizable AuthService and offers a ready-to-use implementation, KeycloakAuthService, for Keycloak integration.

## Key Features
 - Seamless HTTP request interception for adding authentication headers.
 - Handles 401 Unauthorized responses automatically.
 - Fully customizable authentication logic via the AuthService abstract class.
 - Built-in Keycloak support with KeycloakAuthService.
 - Configurable baseURI for API endpoint routing.

## Installation
```bash
npm install @imadelfetouh/auth
```

## Getting Started
### 1. app.config.ts
We will use Keycloak for this example. If you need custom authentication logic, extend the AuthService abstract class and provide your implementation.
```
export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloakAuthInterceptor({
      authInterceptorConfig: {
        apiBaseUri: 'https://my-api.com'
      },
      keycloakAuthServiceConfig: {
        url: "https://my-keycloak.com",
        realm: "my-realm",
        clientId: "my-clientId"
      }
    }),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useExisting: AuthInterceptor,
      multi: true
    },
  ]
};
```
## Library Components
### AuthInterceptor
The AuthInterceptor is the core of the library. It intercepts HTTP requests, appends the authentication token, and handles 401 Unauthorized responses.

#### Configuration
The AuthInterceptor requires:
 - AuthInterceptorConfig to provide a baseURI.
 - An AuthService implementation to manage authentication logic.

### AuthService (Abstract Class)
The AuthService defines the contract for custom authentication logic. You can extend this class to implement your own authentication logic. KeycloakAuthService is such an example

### Injecting AuthInterceptor and AuthService
You can inject AuthService and AuthInterceptor into your components or services. This allows you to access their methods and properties directly.
```
constructor(private authInterceptor: AuthInterceptor, private authService: AuthService) {
}
```

## Customization
### Custom Auth Logic
To provide custom authentication logic, implement AuthService and override the necessary methods.

### Extend Interceptor Logic
You can extend the AuthInterceptor to customize its behavior.
