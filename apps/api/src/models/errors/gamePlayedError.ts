export class GamePlayedError extends Error {
  public code = 'gamePlayedError';

  constructor() {
    super('Game is already played!');
    Object.setPrototypeOf(this, GamePlayedError.prototype);
  }
}
