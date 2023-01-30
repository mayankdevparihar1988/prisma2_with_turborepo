import { lt, intersection, isEqual, map, size, sumBy, toNumber } from 'lodash-es';
import type { GameTicketContext } from '../../../models/bl/gameTicketContext.js';
import type { GameSettings } from '../../../models/bl/gameSettings.js';
import type { GamePoints } from '../../../models/bl/gamePoints.js';
import { PlayerTicket } from '../../../models/playerTicket.js';
import { GamePointsForPlayer } from '../../../models/gameResult.js';

export const wrapLeadingZeros = (values?: string[]): string[] =>
  map(values, (value) => {
    const num = toNumber(value);
    return lt(num, 10) ? `0${num}` : value;
  });

export const wrapLeadingZeroToNumber = (value: string): string => {
  const num = toNumber(value);
  return lt(num, 10) ? `0${num}` : value;
};

export class Rules {
  private settings: GameSettings;

  private gameResult: GameTicketContext;

  constructor(gameSettings: GameSettings, gameResult: GameTicketContext) {
    this.settings = gameSettings;
    this.gameResult = gameResult;
  }

  public calculateMatchForPlayer(playerInput: PlayerTicket): GamePointsForPlayer {
    let result: GamePoints[] = [];
    // result = [...result, ...this.matchName(playerInput)];
    result = [...result, ...this.matchNumbers(playerInput)];
    result = [...result, ...this.matchSuperNumber(playerInput)];
    return { player: playerInput.player, result };
  }

  public static calculatePoint(gamePoints: GamePoints[]): number {
    return sumBy(gamePoints, 'points');
  }

  /*
  public matchName(playerGameInput: GameTicketContext): GamePoints[] {
    const { Ticke: gameTip } = this.gameResult;
    const { tip: playerTip } = playerGameInput;
    const {
      winPoints: { fullInitial: fullInitialsPoints, singleInitial: singleInitialPoints }
    } = this.settings;
    const gameInitials = head(gameTip);
    const playerInitials = head(playerTip);
    const result: GamePoints[] = [];

    if (eq(gameInitials, playerInitials)) {
      result.push({ points: fullInitialsPoints, msg: 'Name full match' });
    } else if (eq(head(gameInitials), head(playerInitials))) {
      result.push({ points: singleInitialPoints, msg: 'Name partial first letter match' });
    }
    return result;
  }
*/
  public matchNumbers(playerGameInput: GameTicketContext): GamePoints[] {
    const { ticket: gameTicket } = this.gameResult;
    const { ticket: playerTicket } = playerGameInput;
    // const gameNumbers = tail(gameTip);
    // const playerNumbers = tail(playerTip);
    // const matches = intersection(gameNumbers, playerNumbers);
    const matches = intersection(gameTicket, wrapLeadingZeros(playerTicket));
    const matchesCount = size(matches);
    return [
      {
        points: this.settings.winPoints.scala[matchesCount],
        msg: `Trefferzahlen: ${matchesCount} by ${matches.join(' ')}`
      }
    ];
  }

  public matchSuperNumber(playerGameInput: GameTicketContext): GamePoints[] {
    const { superNumber: playerSuperNumber } = playerGameInput;
    const { superNumber: gameSuperNumber } = this.gameResult;
    const {
      winPoints: { superNumber }
    } = this.settings;

    // console.log('The superNumber found', includes(playerTip, gameSuperNumber));

    return isEqual(playerSuperNumber, gameSuperNumber) ? [{ points: superNumber, msg: 'SuperZahl' }] : [];
  }
}
