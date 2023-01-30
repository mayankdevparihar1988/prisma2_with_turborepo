import {
  BasicEntityExtension,
  Filter,
  FilterOperator,
  MongoDataSource,
  SortDirection,
  Sorter
} from '@schamane/small-graphql-mongoose-middleware';
import { assign, difference, filter, get, head, isEmpty, map, size, uniqBy } from 'lodash-es';
import { overParams } from '@schamane/serial-exec';
import { differenceInSeconds, isAfter, formatISO } from 'date-fns';
import { inspect } from 'util';
import { GAME_SETTINGS } from '../config/gameSettings.js';
import { GraphqlContext } from '../middleware/graphql.js';
import { GamePlayedResult, GameTicketContext } from '../models/bl/gameTicketContext.js';
import { PlayerAlreadyPlayedError } from '../models/errors/playerAlreadyPlayed.js';
import { Game, Games, GameStatus } from '../models/game.js';
import { PlayerTicket } from '../models/playerTicket.js';
import { Generator } from './gameDefs/v1/generator.js';
import { Rules, wrapLeadingZeros, wrapLeadingZeroToNumber } from './gameDefs/v1/rules.js';
import { ProfileBl } from './profiles.js';
import { generateId } from '../utils/generateId.js';
import { GamePointsForPlayer } from '../models/gameResult.js';

export type CalculatedUserPoint = {
  player: string;
  result: number;
};

export type PointCalculationObj = {
  calculatedUserPoints: CalculatedUserPoint[];
  userMatchResult: GamePointsForPlayer[];
  generatedDraw: GameTicketContext;
};
const GAME_WITHOUT_TICKETS_COMPLETED = 'GAME_WITHOUT_TICKETS_COMPLETED';

const profileBl = new ProfileBl();
export class GamesBl extends MongoDataSource<Game, GraphqlContext> {
  constructor() {
    super(Games, null, [BasicEntityExtension]);
  }

  async filter(filters: Filter[], sort?: Sorter): Promise<Game[] | Partial<Game>[]> {
    const gameList = await super.find(filters, sort);
    console.log('The retrieved Game list is', gameList.toString());
    return gameList;
  }

  async list(sort?: Sorter): Promise<Game[] | Partial<Game>[]> {
    const filters: Filter[] = [
      { name: 'status', operator: FilterOperator.EQ, value: GameStatus.COMPLETED },
      { name: 'totalTickets', operator: FilterOperator.GT, value: 0 }
    ];
    return this.filter(filters, sort);
  }

  // eslint-disable-next-line class-methods-use-this
  async listGameWithPlayerInput(sortInput?: Sorter): Promise<Game[]> {
    console.info('sorter received', sortInput);
    let gamesHistoryQuery = Games.find({
      // TODO: make filter extension to get work with Extensions
      'playerTickets.0': { $exists: true },
      'playerTickets.player': this.context.id,
      status: GameStatus.COMPLETED
    });
    if (!isEmpty(sortInput)) {
      const { name, direction } = sortInput;
      const sortField = assign({}, { [name]: direction });
      gamesHistoryQuery = gamesHistoryQuery.sort(sortField);
    }
    const gamesWithPlayerTickets = await gamesHistoryQuery;
    console.info('Games', inspect(gamesWithPlayerTickets));
    return gamesWithPlayerTickets;
  }

  public async createGame(name: string): Promise<Game | Partial<Game>> {
    console.log('The argument for createGame', { name });
    const createdGame = await this.add({ name });
    return createdGame;
  }

  public async getCurrent(): Promise<Game | Partial<Game>> {
    const filters: Filter[] = [{ name: 'status', operator: FilterOperator.EQ, value: GameStatus.ACTIVE }];
    const sort: Sorter = { name: 'gameDate', direction: SortDirection.ASC };
    const activeGames = await this.filter(filters, sort);
    console.log('Retrived currentGame', activeGames);
    return head(activeGames);
  }

  public async getGamesToComplete(): Promise<Game[] | Partial<Game>[]> {
    const filters: Filter[] = [
      { name: 'status', operator: FilterOperator.EQ, value: GameStatus.ACTIVE },
      { name: 'drawDate', operator: FilterOperator.LT, value: formatISO(Date.now()) }
    ];

    const sort: Sorter = { name: 'drawDate', direction: SortDirection.ASC };
    const activeGames = await this.filter(filters, sort);
    if (isEmpty(activeGames)) {
      return [];
    }
    // TODO Remove it (It was for date time tests)
    const { drawDate: retrivedDrawDate } = head(activeGames);
    console.log('Game to be completed', activeGames);
    console.log('Games DrawDate from mongodb', retrivedDrawDate);
    console.log('Games DrawDate from mongodb to ISO String', formatISO(retrivedDrawDate));
    console.log('Current date in ISOFOrmate', formatISO(Date.now()));
    return activeGames;
  }

  public async getUpcomingGames(): Promise<Game[] | Partial<Game>[]> {
    const filters: Filter[] = [{ name: 'status', operator: FilterOperator.EQ, value: GameStatus.ACTIVE }];
    const sort: Sorter = { name: 'gameDate', direction: SortDirection.ASC };
    const activeGames = await this.filter(filters, sort);
    console.log('Retrived currentGame', activeGames);
    const [current, ...upcommingGames] = activeGames;
    console.log({ current }, { upcommingGames });
    return upcommingGames;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/require-await
  private async getMostCurrentGame(games: Game[] | Partial<Game>[]): Promise<Game | Partial<Game>> {
    let index = 0;
    let distance = 0;
    map(games, (game, i) => {
      const gameDate = get(game, 'gameDate');
      const newDistance = differenceInSeconds(Date.now(), gameDate, { roundingMethod: 'ceil' });
      console.log({ newDistance });
      console.log({ index });
      console.log({ distance });
      if (newDistance > distance) {
        distance = newDistance;
        index = i;
      }
    });

    console.log('Current Game', games[index]);

    return games[index];
  }

  public async getLast(): Promise<Game | Partial<Game>> {
    const filters: Filter[] = [{ name: 'status', operator: FilterOperator.EQ, value: GameStatus.COMPLETED }];
    const sort: Sorter = { name: 'drawDate', direction: SortDirection.DESC };
    const lastGame = await this.filter(filters, sort);
    console.log('Retrived last game', lastGame);
    return head(lastGame);
  }

  // eslint-disable-next-line class-methods-use-this
  private calculatePoints(playerTickets: PlayerTicket[]): PointCalculationObj {
    const generatorBL = new Generator(GAME_SETTINGS);
    const generatedDraw = generatorBL.generate();
    const ruleBl = new Rules(GAME_SETTINGS, generatedDraw);
    const userMatchResult = map(playerTickets, (playerTicket) => ruleBl.calculateMatchForPlayer(playerTicket));
    map(userMatchResult, ({ player, result }) => console.log('player', player, result));
    console.debug(userMatchResult);
    const calculatedUserPoints = map(userMatchResult, ({ player, result }) => ({
      player,
      result: Rules.calculatePoint(result)
    }));
    return {
      calculatedUserPoints,
      userMatchResult,
      generatedDraw
    };
  }

  // eslint-disable-next-line class-methods-use-this
  private async assignPointsToUser(userPointList: Partial<CalculatedUserPoint>[], isTopUp?: boolean): Promise<boolean> {
    await overParams(userPointList, async ({ player, result }) => {
      if (isTopUp) {
        await profileBl.updatePoints(player, GAME_SETTINGS.topUpPoints, true);
      } else {
        await profileBl.updatePoints(player, result);
      }
    });

    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  private async filterGamesWithTickets(games: Game[] | Partial<Game>[]): Promise<Game[] | Partial<Game>[]> {
    console.info('The retrived games', games);

    const gamesWithTickets = filter(games, ({ playerTickets }) => {
      return !isEmpty(playerTickets);
    });

    console.info('Games with tickets', gamesWithTickets);
    const gamesWithoutTickets = difference(games, gamesWithTickets);
    console.info('gamesWithoutTickets', gamesWithoutTickets);
    await overParams(gamesWithoutTickets, async (gameToDelete) => {
      console.info('gameToDelete', gameToDelete);
      const deleteResult = await gameToDelete.remove();
      console.info('The Delete Game is', deleteResult);
    });

    return gamesWithTickets;
  }

  public async completeGame(): Promise<string[]> {
    const gamesToComplet = await this.getGamesToComplete();

    if (isEmpty(gamesToComplet)) {
      console.info('NO ACTIVE GAME TO CLOSE');
      return null;
    }

    const gamesWithTicket = await this.filterGamesWithTickets(gamesToComplet);

    console.log('FilteredGamesWithUserTickets', gamesWithTicket);

    if (isEmpty(gamesWithTicket)) {
      console.info('NO GAME WITH PLAYER TICKET TO CLOSE');
      return [GAME_WITHOUT_TICKETS_COMPLETED];
    }

    const completedGames = [];

    await overParams(gamesWithTicket, async (game) => {
      const completedGame = await this.completeSingleGame(game);
      completedGames.push(completedGame);
    });

    console.log('Completed Games', completedGames);

    return map(completedGames, '_id');
  }

  public async completeSingleGame(game: Game | Partial<Game>) {
    const { playerTickets, drawDate } = game;
    console.info('The DrawDate retrieved', drawDate);
    console.info(`ISAFTER RESULT DATENOW: ${Date.now()} DRAWDATE: ${drawDate}  ISAFTER: ${isAfter(Date.now(), drawDate)}`);

    if (!isAfter(Date.now(), drawDate)) {
      console.error('NO Game to Close No Draw Date is over');
      return null;
    }

    const { calculatedUserPoints, userMatchResult, generatedDraw } = this.calculatePoints(playerTickets);

    // Assign points to winning point
    await this.assignPointsToUser(calculatedUserPoints);

    // LOGIC OF TOP 10 POINTS
    // const playerList = uniqBy(calculatedUserPoints, 'player');
    // console.info('List of player for topup ', playerList);
    // Assign points to topup points to all users who played game
    // await this.assignPointsToUser(playerList, true);

    const completedGame = await this.update({
      ...game.toObject(),
      status: GameStatus.COMPLETED,
      draw: generatedDraw,
      winningTips: userMatchResult
    });

    return completedGame;
  }

  // eslint-disable-next-line @typescript-eslint/require-await, class-methods-use-this
  public async deleteAllActiveGames(): Promise<boolean> {
    const resultedGames = await Games.deleteMany({ status: GameStatus.ACTIVE });
    console.log('Delete Many', resultedGames);
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await, class-methods-use-this
  public async deleteAllCompletedGames(): Promise<boolean> {
    const resultedGames = await Games.deleteMany({ status: GameStatus.COMPLETED });
    console.info('Delete Many', resultedGames);
    return true;
  }

  public async playerSubmit(ticket: string[], superNumber?: string, id?: string): Promise<GamePlayedResult> {
    let resultedGame;

    if (id) {
      resultedGame = await Games.findOne({ _id: id });
    } else {
      resultedGame = await this.getCurrent();
    }
    const {
      _id,
      playerTickets,
      gameSetting: { maxTicketAllowed, ticketLength }
    } = resultedGame;

    // limit user attempts
    if (this.playerTipExists(playerTickets, maxTicketAllowed)) {
      throw new PlayerAlreadyPlayedError();
    }

    // IF USER IS INPUTING THE TICKET FOR FIRST TIME FOR THE GAME
    if (!this.playerTipExists(playerTickets, 1)) {
      // Update the GamePlayed in user profile
      await profileBl.updateGamesPlayed(this.context.id);
    }

    // Validate Tips
    if (size(ticket) !== ticketLength) {
      throw new Error('Tip input size is bigger then allowed Input');
    }

    const currentPlayerTicket = {
      id: generateId(),
      player: this.context.id,
      ticket: wrapLeadingZeros(ticket),
      superNumber: wrapLeadingZeroToNumber(superNumber),
      date: new Date()
    };

    const playerTicketUpdated = isEmpty(playerTickets) ? [currentPlayerTicket] : [...playerTickets, currentPlayerTicket];
    resultedGame.set('playerTickets', playerTicketUpdated);
    const { playerTickets: updatedTickets } = await resultedGame.save();
    const filteredTickets = filter(updatedTickets, ({ player }) => player === this.context.id);

    return { gameID: _id.toString(), tickets: filteredTickets };
  }

  private playerTipExists(playerTickets: PlayerTicket[], allowedUserTips: number): boolean {
    const userId = this.context.id;
    const existingUserTips = filter(playerTickets, (ticket) => {
      return ticket.player === userId;
    });
    return size(existingUserTips) >= allowedUserTips;
  }

  // eslint-disable-next-line class-methods-use-this
  public generateDraw(): GameTicketContext {
    const generator = new Generator(GAME_SETTINGS);
    const generatedGameContext = generator.generate();
    console.log('The generatedGameContext ', generatedGameContext);
    return generatedGameContext;
  }

  // eslint-disable-next-line class-methods-use-this
  protected valuesFilter(): Filter {
    throw new Error('Method not implemented.');
  }
}
