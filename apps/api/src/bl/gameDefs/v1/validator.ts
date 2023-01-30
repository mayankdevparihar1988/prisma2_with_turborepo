import { isArray, isEmpty, isString, includes, size, head, last } from 'lodash-es';
import { PlayerWrongTipError } from '../../../models/errors/playerWrongTip';
import { TicketContext } from '../../../models/bl/gameTicketContext.js';
import { GAME_SETTINGS } from '../../../config/gameSettings.js';
import { Player } from '../../../models/bl/player.js';

const { gameNumbers: ticketsSize } = GAME_SETTINGS;

export class Validator {
  public static validatePlayerticket({ ticket, superNumber }: TicketContext, player: Player): boolean {
    if (!isArray(ticket) || isEmpty(ticket) || size(ticket) !== ticketsSize) {
      throw new PlayerWrongTipError();
    }
    if (!isString(superNumber) || !includes(ticket, superNumber)) {
      throw new PlayerWrongTipError();
    }

    try {
      const nameticket = head(ticket);
      const { firstName, lastName } = player;
      if (player && (head(nameticket) !== head(firstName) || last(nameticket) !== last(lastName))) {
        throw new PlayerWrongTipError();
      }
      return true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return false;
    }
  }
}
