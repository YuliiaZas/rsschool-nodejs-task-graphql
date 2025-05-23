import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ContextValue } from "./types/contextValue.js";
import {
  ChangePostDto,
  ChangePostInputType,
  CreatePostDto,
  CreatePostInputType,
  PostType
} from "./types/post.js";
import {
  ChangeProfileDto,
  ChangeProfileInputType,
  CreateProfileDto,
  CreateProfileInputType,
  ProfileType
} from "./types/profile.js";
import {
  ChangeUserDto,
  ChangeUserInputType,
  CreateUserDto,
  CreateUserInputType,
  UserType
} from "./types/user.js";
import { UUIDType } from "./types/uuid.js";

export const rootMutation = new GraphQLObjectType<object, ContextValue>({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType as GraphQLObjectType,
      args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
      resolve: async (_root, args: { dto: CreateUserDto }, { prisma }) =>
        await prisma.user.create({ data: args.dto }),
    },
    changeUser: {
      type: UserType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) }
      },
      resolve: async (_root, args: { id: string, dto: ChangeUserDto }, { prisma }) =>
        await prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, args: { id: string }, { prisma }) => {
        await prisma.user.delete({ where: { id: args.id } });
        return args.id;
      }
    },

    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, args: { userId: string, authorId: string }, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
        return args.userId;
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_root, args: { userId: string, authorId: string }, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId
            }
          }
        });
        return args.userId;
      },
    },

    createPost: {
      type: PostType as GraphQLObjectType,
      args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
      resolve: async (_root, args: { dto: CreatePostDto }, { prisma }) =>
        await prisma.post.create({ data: args.dto }),
    },
    changePost: {
      type: PostType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) }
      },
      resolve: async (_root, args: { id: string, dto: ChangePostDto }, { prisma }) =>
        await prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, args: { id: string }, { prisma }) => {
        await prisma.post.delete({ where: { id: args.id } });
        return args.id;
      }
    },

    createProfile: {
      type: ProfileType as GraphQLObjectType,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
      resolve: async (_root, args: { dto: CreateProfileDto }, { prisma }) =>
        await prisma.profile.create({ data: args.dto }),
    },
    changeProfile: {
      type: ProfileType as GraphQLObjectType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) }
      },
      resolve: async (_root, args: { id: string, dto: ChangeProfileDto }, { prisma }) =>
        await prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },
    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_root, args: { id: string }, { prisma }) => {
        await prisma.profile.delete({ where: { id: args.id } });
        return args.id;
      }
    },
  },
});
