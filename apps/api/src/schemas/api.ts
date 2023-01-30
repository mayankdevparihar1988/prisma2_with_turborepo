import { gql, IResolvers } from 'apollo-server-express';
import os from 'os';
import { API } from '../config/api.js';

const typeDef = gql`
  directive @deprecated(reason: String = "No longer supported") on INPUT_FIELD_DEFINITION | FIELD_DEFINITION | ENUM_VALUE

  type Query {
    api: ApiInfo!
  }

  type ApiInfo {
    instance: ID!
    version: String!
    name: String!
    arch: String!
  }

  type Mutation {
    api: Boolean
  }

  type Subscription {
    api: Boolean
  }
`;

const resolvers: IResolvers = {
  Query: {
    api: (): Record<string, unknown> => ({ instance: os.hostname(), arch: os.arch, ...API })
  },
  Mutation: {
    api: (): boolean => false
  }
};

export const ApiSchema = { typeDef, resolvers };
