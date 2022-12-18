import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SCHEMAS } from '../constants';
import { HistoryDocument, UserDocument } from '../schemas';
import { UserDefinition, IHistory, UserIdsDefinition } from '../types';

@Injectable()
export class TelegramService {
  constructor(
    @InjectModel(SCHEMAS.USER) private userModel: Model<UserDocument>,
    @InjectModel('History') private historyModel: Model<HistoryDocument>,
  ) {}

  async createUser(payload: UserDefinition) {
    const user = await this.userModel.findOne({ id: payload?.id });

    if (!user) {
      return await this.userModel.create(payload);
    }
  }

  async getUserById(id: number) {
    return this.userModel.findOne({ id });
  }

  async createHistory(id: number, payload: IHistory) {
    const user = await this.userModel.findOne({ id, ban: false });

    if (user) {
      return await this.historyModel.create(payload);
    }
  }

  async getHistoryUserById(userContext: UserIdsDefinition) {
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
