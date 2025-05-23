import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberType } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

export const MemberTypeIdType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: Object.fromEntries(
    Object.keys(MemberTypeId)
      .map((key) => [key, { value: MemberTypeId[key] as string }]),
  ),
});

export const MemberTypeType = new GraphQLObjectType<MemberType>({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeIdType) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
