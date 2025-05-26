import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Static } from '@fastify/type-provider-typebox';
import { Post } from '@prisma/client';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';
import { ContextValue } from '../contextValue.interface.js';
import { changePostByIdSchema, createPostSchema } from '../../posts/schemas.js';

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

export type CreatePostDto = Static<(typeof createPostSchema)['body']>
export type ChangePostDto = Static<(typeof changePostByIdSchema)['body']>

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
