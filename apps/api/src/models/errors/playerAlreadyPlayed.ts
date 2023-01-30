export class PlayerAlreadyPlayedError extends Error {
  public code = 'PlayerAlreadyPlayedError';

  constructor() {
    super('Player already made game tip!');
    Object.setPrototypeOf(this, PlayerAlreadyPlayedError.prototype);
  }
}
