export class PlayerWrongTipError extends Error {
  public code = 'playerWrongTipError';

  constructor() {
    super('Player made invalid game tip!');
    Object.setPrototypeOf(this, PlayerWrongTipError.prototype);
  }
}
