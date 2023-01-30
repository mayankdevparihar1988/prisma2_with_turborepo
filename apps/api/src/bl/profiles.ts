import {
  MongoDataSource,
  BasicEntityExtension,
  Sorter,
  FilterOperator,
  Filter,
  QueryFieldsType,
  GraphqlQueryType
} from '@schamane/small-graphql-mongoose-middleware';
import { capitalize, head, isEmpty, split } from 'lodash-es';
import { PROFILE_INIT_WALLET } from '../config/gameSettings.js';
import { GraphqlContext } from '../middleware/graphql.js';
import { Profile, ProfileInput, Profiles } from '../models/profile.js';

const QueryFields: QueryFieldsType = {
  displayName: { type: GraphqlQueryType.OR, fields: ['firstName', 'lastName'] }
};

export class ProfileBl extends MongoDataSource<Profile, GraphqlContext> {
  constructor() {
    super(Profiles, QueryFields, [BasicEntityExtension]);
  }

  async list(sort?: Sorter, filter?: Filter[]): Promise<Profile[] | Partial<Profile>[]> {
    const res = filter ? await this.find(filter, sort) : await this.all(sort);
    return res;
  }

  filter(filters: Filter[], sort?: Sorter): Promise<Profile[] | Partial<Profile>[]> {
    return super.find(filters, sort);
  }

  async me(): Promise<Profile> {
    const { id: email } = this.context;

    const profile = await this.findByEmail(email);

    if (isEmpty(profile)) {
      console.info(`Onboard user for first access ${email} in DB`);
      await this.onBoard();
      return this.findByEmail(email);
    }
    return profile;
  }

  public async redeemPoints(deduction?: number): Promise<Profile> {
    const { id } = this.context;
    const profile = await this.findByEmail(id);
    const { wallet } = profile.toObject();
    const newWallet = wallet - (deduction || 10);
    return this.update({ ...profile.toObject(), wallet: newWallet });
  }

  public async updateGamesPlayed(id: string): Promise<Profile> {
    const profile = await this.findByEmail(id);
    const { gamesPlayed } = profile.toObject();
    return this.update({ ...profile.toObject(), gamesPlayed: gamesPlayed + 1 });
  }

  public async updatePoints(email: string, points?: number, isTopUp?: boolean): Promise<Profile> {
    const profile = await this.findByEmail(email);
    if (!profile) {
      console.error('profile not found', email, profile);
      return null;
    }
    const { wallet, winningPoints } = profile.toObject();
    const newWallet = wallet + points;
    if (!isTopUp) {
      const newWinningPoints = winningPoints + points;
      return this.update({ ...profile.toObject(), wallet: newWallet, winningPoints: newWinningPoints });
    }
    return this.update({ ...profile.toObject(), wallet: newWallet });
  }

  public async change({ firstName, lastName }: ProfileInput): Promise<Profile> {
    const { id: email } = this.context;
    const profile = await this.findByEmail(email);
    return this.update({ ...profile.toObject(), firstName, lastName });
  }

  private async onBoard(): Promise<Profile> {
    const { id: email } = this.context;
    const [firstName, lastName] = this.guessName();
    return this.add({
      firstName,
      lastName,
      email,
      wallet: PROFILE_INIT_WALLET
    });
  }

  private guessName(): string[] {
    const { id: email } = this.context;
    const [firstName, lastName] = split(head(split(email, '@')), '.');
    return [capitalize(firstName), capitalize(lastName)];
  }

  protected async findByEmail(email: string): Promise<Profile> {
    return head(await this.filter([{ operator: FilterOperator.EQ, name: 'email', value: email }])) as unknown as Profile;
  }

  // eslint-disable-next-line class-methods-use-this
  protected valuesFilter(): Filter {
    throw new Error('Method not implemented.');
  }
}
