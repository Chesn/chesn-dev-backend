import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLServiceContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { GraphQLSchema, GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  private schema?: GraphQLSchema;

  serverWillStart(service: GraphQLServiceContext) {
    this.schema = service.schema;
  }

  requestDidStart(): GraphQLRequestListener {
    return {
      didResolveOperation: ({ request, document }) => {
        const complexity = getComplexity({
          schema: this.schema as GraphQLSchema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity >= 20) {
          throw new GraphQLError(
            `Query is too complex: ${complexity}. Maximum allowed complexity: 20.`,
          );
        }
      },
    };
  }
}
