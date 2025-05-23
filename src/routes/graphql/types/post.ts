import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Post } from '@prisma/client';
import { ContextValue } from './contextValue.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';

export const PostType = new GraphQLObjectType<Post, ContextValue>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: new GraphQLNonNull(UserType),
      resolve: async (post, _args, { prisma }) =>
        await prisma.user.findUnique({ where: { id: post.authorId } }),
    }
  }),
});
