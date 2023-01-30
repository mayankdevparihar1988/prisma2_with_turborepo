import { PlayerTicket } from '../playerTicket';

export interface TicketContext {
  ticket: string[];
  superNumber?: string;
}
export interface GameTicketContext extends TicketContext {
  date: Date;
}

export interface GamePlayedResult {
  gameID: string;
  tickets: PlayerTicket[];
}
