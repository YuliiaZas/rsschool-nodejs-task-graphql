import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: { type: GraphQLString },
    // profile: { type: ProfileType },
    posts: { type: new GraphQLNonNull(
      new GraphQLList(new GraphQLNonNull(GraphQLString))
      // new GraphQLList(new GraphQLNonNull(PostType))
    ) },
    // userSubscribedTo: { type: new GraphQLNonNull(
    //  new GraphQLList(new GraphQLNonNull(UsetType))
    // ) },
    // subscribedToUser: { type: new GraphQLNonNull(
    //  new GraphQLList(new GraphQLNonNull(UsetType))
    // ) },
  },
});