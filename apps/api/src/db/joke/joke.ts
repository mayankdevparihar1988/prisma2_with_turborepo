/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable class-methods-use-this */
import { PrismaClient, Joke } from '@prisma/client';
import { Response } from '../../models/bl/response';

const prisma = new PrismaClient();
export class JokeDao {
  public async getlist(top?: number, skip?: number): Promise<Joke[]> {
    let jokes: Joke[] = [];
    try {
      jokes = await prisma.joke.findMany();
      console.log('Jokes are', jokes);
    } catch (error) {
      console.error('Error in JokeDao getlist', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
    return jokes;
  }

  /*
  // A New error handling pattern
  public async getData(): Promise<Response> {
    try {
      // Call a dummy async 'fetch'-functoin
      const result = 'http:google.com';
      throw new Error('Error from getData Call');
      return { result };
    } catch (error) {
      return { error };
    }
  }
  */
}
