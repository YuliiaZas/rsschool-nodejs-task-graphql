import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UserType } from './types/user.js';
import { ContextValue } from './types/contextValue.js';
import { MemberTypeId, MemberTypeType } from './types/memberType.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UUIDType } from './types/uuid.js';

export const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_root, _args, { prisma }: ContextValue) =>
        await prisma.user.findMany(),
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }: ContextValue) =>
        await prisma.user.findUnique({ where: { id } }),
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_root, _args, { prisma }: ContextValue) =>
        await prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberTypeType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_root, { id } : { id: string }, { prisma }: ContextValue) =>
        await prisma.memberType.findUnique({ where: { id } }),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_root, _args, { prisma }: ContextValue) =>
        await prisma.post.findMany(),
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }: ContextValue) =>
        await prisma.post.findUnique({ where: { id } }),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_root, _args, { prisma }: ContextValue) =>
        await prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }: ContextValue) =>
        await prisma.profile.findUnique({ where: { id } }),
    },
  },
});
