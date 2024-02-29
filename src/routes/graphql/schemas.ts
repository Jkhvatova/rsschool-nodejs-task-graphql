import { Type } from '@fastify/type-provider-typebox';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserInputType, UserType, UserUpdateInputType, UserUpdateInput } from './types/user.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { MemberType, MemberTypeId } from './types/member.js';
import { PostType } from './types/post.js';

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
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source,  id: string ) => {
        return await prisma.post.findUnique({
          where: { id },
        });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async () => {
        return await prisma.post.findMany();
      },
    },
  },
});

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        data: { type: UserInputType },
      },
      resolve: async (_source, data: {name: string, balance: number}) => {
        return await prisma.user.create({
          data});
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        data: { type: UserUpdateInputType },
      },
      resolve: async (_source, args: { id: string, data: { name: string, balance: number } }, { prisma }: { prisma: PrismaClient }) => {
        const { id, data } = args;
        return await prisma.user.update({
          where: { id },
          data: data as UserUpdateInput,
        });
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_source, args: { id: string }) => {
        return await prisma.user.delete({
          where: { id: args.id },
        });
      },
    },
  },
});

export const resultGraphQlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

