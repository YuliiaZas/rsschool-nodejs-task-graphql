import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType
} from 'graphql-parse-resolve-info';
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
      // resolve: async (_root, _args, { prisma }) =>
      //   await prisma.user.findMany(),
      resolve: async (_root, _args, { prisma }, info) => {
        const parsedResolveInfoFragment = parseResolveInfo(info);
        if (!parsedResolveInfoFragment) {
          throw new Error('Could not parse resolve info');
        }
        const simplifiedFragment = simplifyParsedResolveInfoFragmentWithType(
          parsedResolveInfoFragment as ResolveTree, info.returnType
        );

        const includeUserSubscribedTo = Boolean(simplifiedFragment.fieldsByTypeName.User?.userSubscribedTo);
        const includeSubscribedToUser = Boolean(simplifiedFragment.fieldsByTypeName.User?.subscribedToUser);

        const users = await prisma.user.findMany({
          include: {
            ...(includeUserSubscribedTo && {userSubscribedTo: includeUserSubscribedTo}),
            ...(includeSubscribedToUser && {subscribedToUser: includeSubscribedToUser})
          }
        });

        return users.map(user => ({
          ...user,
          userSubscribedTo: includeUserSubscribedTo
            ? user.userSubscribedTo.map(rel => users.find(u => u.id === rel.authorId)).filter(Boolean)
            : undefined,
          subscribedToUser: includeSubscribedToUser
            ? user.subscribedToUser.map(rel => users.find(u => u.id === rel.subscriberId)).filter(Boolean)
            : undefined,
        }));
      },
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
