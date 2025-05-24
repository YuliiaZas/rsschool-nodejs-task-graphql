import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  ExecutionResult,
  graphql,
  GraphQLSchema,
  parse,
  validate,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { ContextValue } from './contextValue.interface.js';
import { rootMutationType } from './types/rootMutation.js';
import { rootQueryType } from './types/rootQuery.js';
import { createLoaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply): Promise<ExecutionResult> {
      const { query, variables } = req.body;
      // console.log('---query---', query);
      // console.log('---variables---', variables);

      const validationErrors = validate(schema, parse(query), [depthLimit(5)]);
      if (validationErrors.length > 0) {
        return reply.status(400).send({ errors: validationErrors });
      }
      console.log("validationErrors: ", validationErrors);

      const contextValue: ContextValue = {
        prisma,
        loaders: createLoaders(prisma),
      }

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue,
      })
    },
  });
};

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});

export default plugin;
