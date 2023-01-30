import { includes, map, random, times, toNumber } from 'lodash-es';
import { customAlphabet } from 'nanoid';
import type { GameTicketContext } from '../../../models/bl/gameTicketContext.js';
import type { GameSettings } from '../../../models/bl/gameSettings.js';

export class Generator {
  private settings: GameSettings;

  constructor(gameSettings: GameSettings) {
    this.settings = gameSettings;
  }

  public generate(): GameTicketContext {
    const { gameNumbers } = this.settings;

    let ticket = [];
    map(times(gameNumbers), () => {
      const num = this.zahlen8(ticket);
      ticket = [...ticket, num];
    });

    // Generate superNumber
    // const superNumberIndex = random(0, gameNumbers - 1);
    // const superNumber = ticket[superNumberIndex];

    // Generate SuperNumber
    const superNumber = this.zahlen8(ticket);

    console.log('Ziehung:', ticket);
    console.log('SuperNumber:', superNumber);

    return { ticket, superNumber, date: new Date() };
  }

  private zahlen8(tip: string[]): string {
    const { numberAlphabet, alphaNum, maxNumber } = this.settings;
    const numberGenerator = customAlphabet(numberAlphabet, alphaNum);
    const result = numberGenerator();
    if (result === '00' || toNumber(result) > maxNumber || includes(tip, result)) {
      return this.zahlen8(tip);
    }
    return result;
  }

  private alphabet2(): string {
    const { nameAlphabet, alphaNum } = this.settings;
    const charGenerator = customAlphabet(nameAlphabet, alphaNum);

    return charGenerator();
  }
}
