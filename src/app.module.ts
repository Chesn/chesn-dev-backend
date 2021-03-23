import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule, GraphQLSchemaHost } from '@nestjs/graphql';

import {
  AuthModule,
  CategoryModule,
  PermissionModule,
  PostModule,
  RoleModule,
  UserModule,
} from './resolvers';
import { ComplexityPlugin } from './common/plugins/complexity.plugin';

import config from './configs/config';
import { GraphqlConfig } from './configs/config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');

        return {
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig?.sortSchema,
          autoSchemaFile:
            graphqlConfig?.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig?.debug,
          playground: graphqlConfig?.playgroundEnabled,
          context: ({ request, reply }) => ({ request, reply }),
        };
      },
      inject: [ConfigService, GraphQLSchemaHost],
    }),
    AuthModule,
    CategoryModule,
    PermissionModule,
    PostModule,
    RoleModule,
    UserModule,
  ],
  providers: [ComplexityPlugin],
})
export class AppModule {}
