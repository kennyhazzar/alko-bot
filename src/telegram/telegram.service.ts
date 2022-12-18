import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SCHEMAS } from '../constants';
import { HistoryDocument, UserDocument } from '../schemas';
import {
  UserDefinition,
  IHistory,
  UserIdsDefinition,
  HistoryEntityResult,
} from '../types';

@Injectable()
export class TelegramService {
  constructor(
    @InjectModel(SCHEMAS.USER) private userModel: Model<UserDocument>,
    @InjectModel('History') private historyModel: Model<HistoryDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(payload: UserDefinition) {
    const user = await this.userModel.findOne({ id: payload?.id });

    if (!user) {
      return await this.userModel.create(payload);
    }
  }

  async createHistory(payload: IHistory) {
    return this.historyModel.create(payload);
  }

  async getStats(
    userContext: UserIdsDefinition,
  ): Promise<HistoryEntityResult[]> {
    const [history, users] = await Promise.all([
      this.historyModel.find({
        chatId: userContext?.chatId,
      }),
      this.userModel.find({ chatId: userContext?.chatId }),
    ]);

    if (!history) {
      throw new Error('В этой группе нету пользователей');
    }

    return users.map((user) => {
      const total = history.reduce((sum, current) => {
        if (current.id === user.id && userContext.chatId === current.chatId) {
          return sum + current.volume;
        } else {
          return sum + 0;
        }
      }, 0);

      return {
        ...user,
        result: total,
      };
    });
  }

  private async getHistoryUserById(userContext: UserIdsDefinition) {
    return this.userModel.find(userContext);
  }

  async banUser(adminId: number, userId: number, instance = true) {
    const [admin, user] = await Promise.all([
      this.userModel.findOne({ id: adminId, role: 'admin' }),
      this.userModel.findOne({ id: userId }),
    ]);

    if (admin && user) {
      user.ban = instance;

      return await user.save();
    }
  }
}
