import { gql } from 'apollo-server-express';
import { DateScalarType } from './models/dateScalarType.js';
import { UTCDateTimeScalarType } from './models/UTCDateTimeScalarType.js';

const typeDef = gql`
  scalar Date
  scalar UTCDateTime
`;

const resolvers = {
  Date: DateScalarType,
  UTCDateTime: UTCDateTimeScalarType
};

export const DateScalarSchema = { typeDef, resolvers };
