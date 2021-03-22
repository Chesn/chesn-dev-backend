import { Config } from './config.interface';

const isDev = process.env.NODE_ENV === 'development';

const config: Config = {
  nest: {
    port: 9000,
    host: '0.0.0.0',
  },
  cors: {
    enabled: !isDev,
  },
  swagger: {
    enabled: isDev,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  helmet: {
    enabled: true,
    directives: {
      defaultSrc: [`'self'`],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'fonts.googleapis.com',
        'cdn.jsdelivr.net',
      ],
      fontSrc: [`'self'`, 'fonts.gstatic.com'],
      imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`, 'cdn.jsdelivr.net'],
    },
  },
  graphql: {
    playgroundEnabled: isDev,
    debug: isDev,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '1h',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
