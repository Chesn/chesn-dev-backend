import { CookieSerializeOptions } from 'fastify-cookie';

export interface Config {
  nest?: NestConfig;
  cors?: CorsConfig;
  cookies?: CookiesConfig;
  swagger?: SwaggerConfig;
  helmet?: HelmetConfig;
  graphql?: GraphqlConfig;
  security?: SecurityConfig;
}

export interface NestConfig {
  port?: number;
  host?: string;
}

export interface CorsConfig {
  enabled: boolean;
  origin: string[];
}

export interface CookiesConfig extends CookieSerializeOptions {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface HelmetConfig {
  enabled: boolean;
  directives: {
    [key: string]: string[];
  };
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
