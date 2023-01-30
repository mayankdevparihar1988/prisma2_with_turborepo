import { gql } from 'apollo-server-express';
import { FilterValueScalarType } from './models/filterValueScalarType.js';

const typeDef = gql`
  scalar FilterValue
`;

const resolvers = {
  FilterValue: FilterValueScalarType
};

export const FilterValueScalarSchema = { typeDef, resolvers };
