import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserInputType, UserType, UserUpdateInputType, UserUpdateInput } from './types/user.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { MemberType, MemberTypeId } from './types/member.js';

const prisma = new PrismaClient();

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) }
      },
      resolve: async (_source, id: string) => {
        const memberType = await prisma.memberType.findUnique({
          where: { id }
        });

        return memberType;
      }
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async () => {
        return await prisma.memberType.findMany();
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source,  id: string ) => {
        return await prisma.user.findUnique({
          where: { id },
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
        return await prisma.user.findMany();
      },
    },
  },
});

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

  },
});

export const resultGraphQlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

