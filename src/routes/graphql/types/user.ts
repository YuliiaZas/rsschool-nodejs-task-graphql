import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { User } from '@prisma/client';
import { ContextValue } from './contextValue.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType<User, ContextValue>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { 
      type: ProfileType as GraphQLObjectType,
      resolve: async (user, _args, { prisma }) =>
        await prisma.profile.findUnique({ where: { userId: user.id } }),
    },
    posts: { 
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user, _args, { prisma }) =>
        await prisma.post.findMany({ where: { authorId: user.id } }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, { prisma }) => {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: { author: true },
        });
        return subscribers.map((subscriber) => subscriber.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _args, { prisma }) => {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: { subscriber: true },
        });
        return subscribers.map((subscriber) => subscriber.subscriber);
      },
    },
  }),
});
