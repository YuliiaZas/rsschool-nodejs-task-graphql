import {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserType } from './types/user.js';
import { PrismaClient } from '@prisma/client';

export const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_root, _args, { prisma }: { prisma: PrismaClient }) => {
        return await prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (
        _root,
        { id } : { id: string },
        { prisma }: { prisma: PrismaClient }
      ) => {
        const user = await prisma.user.findUnique({ where: { id } });
        if (user === null) {
          throw new GraphQLError('User not found', {
            extensions: {
              code: 'NOT_FOUND',
              http: { status: 404 },
            },
          });
        }
        return user;
      },
    }
  },
});
