import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  ExecutionResult,
  graphql,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  validate,
} from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { UserType } from './types/user.js';
import { PrismaClient } from '@prisma/client';

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
    async handler(req): Promise<ExecutionResult> {
      const { query, variables } = req.body;
      console.log('------', query, variables);

      const validationErrors = validate(schema, parse(query), [depthLimit(5)]);
      if (validationErrors.length > 0) {
        console.log('validationErrors: ', validationErrors.map((error) => ({
            message: error.message,
            locations: error.locations,
          })));
        return {
          errors: validationErrors
        };
      }
      console.log("validationErrors: ", validationErrors, parse(query));

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      })
    },
  });
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: async (_root, _args, { prisma }: { prisma: PrismaClient }) => {
          return await prisma.user.findMany();
        },
      }
    },
  }),
  mutation: undefined,
  subscription: undefined,
});


export default plugin;
