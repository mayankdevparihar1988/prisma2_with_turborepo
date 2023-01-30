import { get } from 'lodash-es';
import {
  GraphQlServer,
  makeSchema,
  installGraphQlSubscriptions,
  graphQLAuthCreateContext,
  User,
  GrapqhContext
} from '@schamane/small-graphql-mongoose-middleware';
import type { ApolloServer, IExecutableSchemaDefinition } from 'apollo-server-express';
import type { Application } from 'express';
import { inspect } from 'node:util';
import * as schemasDefs from '../schemas/index.js';
import { CURRENT_AUTH_STRATEGY } from './security.js';
import { GraphQlOptions } from '../config/grapqhl.js';
import { GamesBl } from '../bl/games.js';
import { ProfileBl } from '../bl/profiles.js';

export const initGraphQlSubscriptions = installGraphQlSubscriptions;

export interface GraphqlUserContext extends GrapqhContext {
  objectId?: string;
}

export type DataSources = {
  games: GamesBl;
  profile: ProfileBl;
};

export type DataSourcesContext = {
  dataSources: DataSources;
};

export type GraphqlContext = GraphqlUserContext;

export const createDataSources = (): DataSources => ({
  games: new GamesBl(),
  profile: new ProfileBl()
});

export const initGraphQl = (app: Application): ApolloServer => {
  const dataSources = createDataSources;
  const schema = makeSchema(schemasDefs as unknown as IExecutableSchemaDefinition[]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createContext: graphQLAuthCreateContext = (user: User, authInfo: any) => {
    const newUser = { ...user, groups: get(user, 'groups', []) } as GraphqlContext;

    // console.debug('authInfo', inspect(authInfo));

    // TODO: not needed
    /*
    delete newUser.objectId;
    const person = await Persons.findOne({ email: newUser.id }).select('_id').exec();
    if (person) {
      const { _id: objectId } = person.toObject();
      newUser.objectId = objectId;
    }

    if (CURRENT_AUTH_STRATEGY === 'JWT') {
      const { checkLocalScope } = authInfo;
      if (checkLocalScope('User')) {
        newUser.groups.push(ACCESS_ROLES.USER);
      }
      if (checkLocalScope('Doctor')) {
        newUser.groups.push(ACCESS_ROLES.VETERENERIAN);
      }
      if (checkLocalScope('Admin')) {
        newUser.groups.push(ACCESS_ROLES.ADMIN);
      }
    }
    */
    return newUser;
  };

  return GraphQlServer(app, dataSources, GraphQlOptions, schema, CURRENT_AUTH_STRATEGY, createContext);
};
