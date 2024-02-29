import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

export const PostType = new GraphQLObjectType ({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) }, // new GraphQLNonNull(GraphQLUUID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }
})

export const CreatePost = new GraphQLObjectType ({
  name: "CreatePost",
  fields: {
    title: {type: new GraphQLNonNull(GraphQLString)},
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }
})

export const ChangePost = new GraphQLObjectType ({
  name: "ChangePost",
  fields: {
    title: {type: GraphQLString},
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }
})