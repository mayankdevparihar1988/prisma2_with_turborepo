export interface GameSettings {
  alphaNum: number;
  gameNumbers: number;
  maxNumber: number;
  nameAlphabet: string;
  numberAlphabet: string;
  maxTicketAllowed: number;

  topUpPoints: number;
  ticketPrice: number;
  schedule: {
    drawTime: { hours: number; minutes: number; seconds: number };
  };
  winPoints: {
    singleInitial?: number;
    fullInitial?: number;
    superNumber: number;
    scala: number[];
  };
}
