import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeIdType, MemberTypeType } from './memberType.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { ContextValue } from '../contextValue.interface.js';

export const rootQueryType = new GraphQLObjectType<object, ContextValue>({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_root, _args, { prisma }) =>
        await prisma.user.findMany(),
    },
    user: {
      type: UserType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }) =>
        await prisma.user.findUnique({ where: { id } }),
    },
    memberTypes: {
      type: new GraphQLList(MemberTypeType),
      resolve: async (_root, _args, { prisma }: ContextValue) =>
        await prisma.memberType.findMany(),
    },
    memberType: {
      type: MemberTypeType,
      args: { id: { type: new GraphQLNonNull(MemberTypeIdType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }) =>
        await prisma.memberType.findUnique({ where: { id } }),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_root, _args, { prisma }) =>
        await prisma.post.findMany(),
    },
    post: {
      type: PostType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }) =>
        await prisma.post.findUnique({ where: { id } }),
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_root, _args, { prisma }) =>
        await prisma.profile.findMany(),
    },
    profile: {
      type: ProfileType as GraphQLObjectType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, { id } : { id: string }, { prisma }) =>
        await prisma.profile.findUnique({ where: { id } }),
    },
  },
});
