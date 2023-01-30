import { gql, IResolvers } from 'apollo-server-express';
import { ApplicationPubSub, authenticated, Filter, FilterOperator, Sorter } from '@schamane/small-graphql-mongoose-middleware';
import { filter, includes, last } from 'lodash-es';
import { DataSourcesContext, GraphqlContext } from '../middleware/graphql.js';
import { Game, GameStatus } from '../models/game.js';
import { GameSettings, GameType } from '../models/gameSettings.js';
import { EVENTS } from '../config/grapqhl.js';

const typeDef = gql`
  extend type Query {
    game: GameQuery!
  }

  type GameQuery {
    current: Game
    upcomming: [Game]
    last: Game
    list(sort: Sorter, filters: [Filter]): [Game]!
    listHistory(sort: Sorter): [Game]
    random: GameTicketContext!
  }

  enum GameStatus {
    ACTIVE
    COMPLETED
    INCOMING
  }

  enum GameType {
    FIVEOFFIFTY
    SIXOFFIFTY
  }

  type GameTicketContext {
    ticket: [String]
    superNumber: String
    date: UTCDateTime
  }

  type WinningTip {
    player: String
    result: [GamePoints]
    totalPoints: Int
  }

  type GamePoints {
    points: Int
    msg: String
  }

  type PlayerTicket {
    id: ID!
    player: String!
    date: UTCDateTime!
    ticket: [String]!
    superNumber: String
  }

  type OnlyPlayerInTicket {
    id: ID!
    player: String!
  }

  type WinPoints {
    superNumber: Int
    sixMatch: Int
    fiveMatch: Int
    fourMatch: Int
    threeMatch: Int
    twoMatch: Int
    oneMatch: Int
  }

  type GameSetting {
    gameType: GameType
    ticketLength: Int
    inputDigitRange: Int
    maxTicketAllowed: Int
    winPoints: WinPoints
    topupAmount: Int
    ticketPrice: Int
  }

  type Game {
    id: ID!
    name: String!
    gameDate: UTCDateTime!
    drawDate: UTCDateTime
    draw: GameTicketContext
    details: GameDetails
    status: GameStatus
    winningTips: [WinningTip]
    gameSetting: GameSetting
    playerTickets(isAdmin: Boolean): [PlayerTicket]
    totalParticipants: Int
    totalTickets: Int
    gameTotalWinPoints: Int
  }

  type GameDetails {
    displayName: String!
  }

  input PlayerTicketInput {
    ticket: [String]!
    superNumber: String!
    gameId: ID
  }

  input GameCreateInput {
    name: String!
  }

  extend type Mutation {
    play(playerTicket: PlayerTicketInput!): ID
    create(gameInput: GameCreateInput): Game!
    completeGame: [ID]
  }

  type GameSubscriptionPlayed {
    played: ID!
  }
  type GameSubscriptionCreate {
    created: ID!
  }
  type GameSubscriptionCompleted {
    completed: ID!
  }
  type GameSubscriptionChanged {
    changed: ID!
  }

  extend type Subscription {
    gamePlayed: GameSubscriptionPlayed
    gameCreated: GameSubscriptionCreate
    gameCompleted: GameSubscriptionCompleted
    gameChanged: GameSubscriptionChanged
  }
`;

const resolvers: IResolvers = {
  Query: {
    game: authenticated(() => ({}))
  },
  Mutation: {
    play: authenticated(
      async (
        _,
        { playerTicket: { ticket, superNumber, gameId } },
        { id, dataSources: { games, profile } }: GraphqlContext & DataSourcesContext
      ) => {
        console.log('The userId is', id);
        console.log('superNumber input', superNumber);
        const { gameID } = await games.playerSubmit(ticket, superNumber, gameId);
        console.log(gameID, typeof gameID);
        const updateProfile = await profile.redeemPoints();
        console.log('The updateProfile', updateProfile);
        ApplicationPubSub.publish(EVENTS.GAME.PLAYED, { gamePlayed: { played: gameID } });
        ApplicationPubSub.publish(EVENTS.PROFILE.CHANGED, { profile: { changed: updateProfile } });
        return gameID;
      }
    ),
    create: authenticated(async (_, { gameInput: { name } }, { dataSources: { games } }: DataSourcesContext) => {
      const createdGame = await games.createGame(name);
      ApplicationPubSub.publish(EVENTS.GAME.CREATED, { gameCreated: { created: createdGame._id } });
      return createdGame;
    }),
    completeGame: authenticated(async (_, __2, { dataSources: { games } }: DataSourcesContext) => {
      const completedGame = await games.completeGame();
      if (!completedGame) {
        return ['NO ACTIVE GAME FOUND'];
      }
      ApplicationPubSub.publish(EVENTS.GAME.COMPLETED, { gameCompleted: { completed: last(completedGame) } });
      console.log('Compleated Game', completedGame);
      return completedGame;
    })
  },

  GameQuery: {
    current: authenticated((_1, __2, { dataSources: { games } }: DataSourcesContext) => {
      return games.getCurrent();
    }),

    upcomming: authenticated((_1, __2, { dataSources: { games } }: DataSourcesContext) => {
      return games.getUpcomingGames();
    }),
    last: authenticated((_1, __2, { dataSources: { games } }: DataSourcesContext) => {
      return games.getLast();
    }),
    list: authenticated((_, { sort }: { sort: Sorter }, { dataSources: { games } }: DataSourcesContext) => {
      return games.list(sort);
    }),
    listHistory: authenticated(async (_, { sort }: { sort: Sorter }, { dataSources: { games } }: DataSourcesContext) => {
      const listOfGamesWithPlayerTickets = await games.listGameWithPlayerInput(sort);
      console.log('list of games', listOfGamesWithPlayerTickets);
      return listOfGamesWithPlayerTickets;
    }),
    random: authenticated((_1, _2, { dataSources: { games } }: DataSourcesContext) => {
      return games.generateDraw();
    })
  },
  Game: {
    playerTickets: (game: Game, { isAdmin }, { id, groups }: GraphqlContext) => {
      console.log('isAdmin', isAdmin);
      const tickets = game.toObject()?.playerTickets;
      // Lotto Rule: Hide the tipps of other user Always
      if (isAdmin) {
        return tickets;
      }
      return filter(tickets, ({ player }) => player === id);
    },
    details: ({ gameDate }: Game) => gameDate,
    status: ({ status }: Game) => (includes(status, 'active') ? GameStatus.ACTIVE : GameStatus.COMPLETED),
    winningTips: ({ winningTips }: Game) => winningTips,
    gameSetting: ({ gameSetting }: Game) => gameSetting
  },
  GameDetails: {
    displayName: (gameDate: Date) => `Game: ${gameDate}`
  },
  GameStatus: {
    ACTIVE: GameStatus.ACTIVE,
    COMPLETED: GameStatus.COMPLETED,
    INCOMING: GameStatus.INCOMING
  },
  GameSetting: {
    gameType: ({ gameType }: GameSettings) => {
      console.log('The retrived GameType', gameType, includes(gameType, 'fiveOfFifty'));
      return includes(gameType, 'fiveOfFifty') ? GameType.FIVEOFFIFTY : GameType.SIXOFFIFTY;
    }
  },
  GameType: {
    FIVEOFFIFTY: GameType.FIVEOFFIFTY,
    SIXOFFIFTY: GameType.SIXOFFIFTY
  },
  Subscription: {
    gamePlayed: {
      subscribe: (): unknown => ApplicationPubSub.asyncIterator([EVENTS.GAME.PLAYED])
    },
    gameCreated: {
      subscribe: (): unknown => ApplicationPubSub.asyncIterator([EVENTS.GAME.CREATED])
    },
    gameCompleted: {
      subscribe: (): unknown => ApplicationPubSub.asyncIterator([EVENTS.GAME.COMPLETED])
    },
    gameChanged: {
      subscribe: (): unknown => ApplicationPubSub.asyncIterator([EVENTS.GAME.CHANGED])
    }
  }
};

export const GamesSchema = { typeDef, resolvers };
