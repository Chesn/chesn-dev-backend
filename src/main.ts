import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'fastify-helmet';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyCsrf from 'fastify-csrf';

import {
  CookiesConfig,
  CorsConfig,
  HelmetConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';

import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const cookiesConfig = configService.get<CookiesConfig>('cookies');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const helmetConfig = configService.get<HelmetConfig>('helmet');

  if (swaggerConfig?.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  if (corsConfig?.enabled) {
    app.enableCors({
      origin: corsConfig.origin,
    });
  }

  if (cookiesConfig?.enabled) {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    });

    app.register(fastifyCsrf);
  }

  if (helmetConfig?.enabled) {
    app.register(helmet, {
      contentSecurityPolicy: {
        directives: helmetConfig?.directives,
      },
    });
  }

  await app.listen(
    process.env.PORT || nestConfig?.port || 9000,
    process.env.HOST || nestConfig?.host || '0.0.0.0',
  );
})();
