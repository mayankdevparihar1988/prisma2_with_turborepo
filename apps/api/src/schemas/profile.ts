import { gql, IResolvers } from 'apollo-server-express';
import { ApplicationPubSub, authenticated, Filter, Sorter } from '@schamane/small-graphql-mongoose-middleware';
import { DataSourcesContext } from '../middleware/graphql.js';
import { ProfileInput } from '../models/profile.js';
import { EVENTS } from '../config/grapqhl.js';

const typeDef = gql`
  extend type Query {
    profile: ProfileQuery!
  }

  type ProfileQuery {
    """
    me query for user details
    """
    me: Profile!
    list(sort: Sorter, filter: [Filter]): [Profile]!
    getProfileWithRank(email: String!): Profile
  }

  type Profile {
    id: ID!
    firstName: String!
    lastName: String!
    wallet: Int!
    email: String!
    gamesPlayed: Int
    winningPoints: Int
    rank: Int
  }

  type GameTips {
    gameId: ID!
  }

  extend type Mutation {
    profile: ProfileMutation!
  }

  type ProfileMutation {
    change(profile: ProfileInput!): Profile
  }

  input ProfileInput {
    firstName: String!
    lastName: String!
  }

  type ProfileSubscription {
    changed: Profile
  }

  extend type Subscription {
    profile: ProfileSubscription
  }
`;

const resolvers: IResolvers = {
  Query: {
    profile: authenticated(() => ({}))
  },
  ProfileQuery: {
    me: authenticated((_1, _2, { dataSources: { profile } }: DataSourcesContext) => profile.me()),
    list: authenticated((_, { sort, filter }: { sort: Sorter; filter: Filter[] }, { dataSources: { profile } }: DataSourcesContext) => {
      return profile.list(sort, filter);
    })
  },
  Mutation: {
    profile: authenticated(() => ({}))
  },
  ProfileMutation: {
    change: authenticated(
      async (_1, { profile: profileInput }: { profile: ProfileInput }, { dataSources: { profile } }: DataSourcesContext) => {
        const updatedProfile = await profile.change(profileInput);
        ApplicationPubSub.publish(EVENTS.PROFILE.CHANGED, { profile: { changed: updatedProfile } });
        return updatedProfile;
      }
    )
  },
  Subscription: {
    profile: {
      subscribe: (): unknown => ApplicationPubSub.asyncIterator([EVENTS.PROFILE.CHANGED])
    }
  }
};

export const ProfileSchema = { typeDef, resolvers };
