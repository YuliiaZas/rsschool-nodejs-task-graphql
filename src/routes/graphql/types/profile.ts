import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Profile } from '@prisma/client';
import { ContextValue } from './contextValue.js';
import { MemberTypeType } from './memberType.js';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

export const ProfileType = new GraphQLObjectType<Profile, ContextValue>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: async (profile, _args, { prisma }) =>
        await prisma.memberType.findUnique({ where: { id: profile.memberTypeId } }),
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: async (profile, _args, { prisma }) =>
        await prisma.user.findUnique({ where: { id: profile.userId } }),
    }
  }),
});

export type ChangeProfileDto = {
  isMale?: boolean,
  yearOfBirth?: number,
  memberTypeId?: string,
}

export type CreateProfileDto = Required<ChangeProfileDto> & {
  userId: string,
};

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
  }),
});
