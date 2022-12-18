import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { SCHEMAS } from '../../constants';
import { greetingNewUser } from '../../messages';
import { StatsDocument, UserDocument } from '../../schemas';
import { UserDefinition } from '../../types';

@Update()
export class MainUpdate {
  private isFirstStart = true;

  constructor(
    @InjectModel(SCHEMAS.USER) private userModel: Model<UserDocument>,
    @InjectModel(SCHEMAS.LOGS) private statsModel: Model<StatsDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.firstStart();
  }

  private async firstStart() {
    const allCount = await this.userModel.count();

    if (!(allCount === 0)) {
      this.isFirstStart = false;
    }
  }

  @Use()
  async logData(ctx: Context, next: () => Promise<void>) {
    let user: UserDefinition &
      Document<any, any, any> & {
        _id: Types.ObjectId;
      };

    try {
      if (this.isFirstStart) {
        await this.userModel.create({
          id: ctx.from.id,
          chatId: ctx.chat.id,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          username: ctx.from?.username,
          language_code: ctx.from?.language_code,
          is_premium: ctx.from?.is_premium,
          typeOfChat: ctx.chat.type,
          role: 'admin',
        });

        ctx.reply('Вы админ! Воспользуйтесь командой /start еще раз.');

        this.isFirstStart = false;
        return;
      }

      user = await this.userModel.findOne({ id: ctx.from.id });

      if (!user) {
        user = await this.userModel.create({
          id: ctx.from.id,
          chatId: ctx.chat.id,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          username: ctx.from?.username,
          language_code: ctx.from?.language_code,
          is_premium: ctx.from?.is_premium,
          typeOfChat: ctx.chat.type,
        });

        await ctx.reply(
          greetingNewUser(ctx.from?.first_name || ctx.from?.username),
        );

        return;
      }

      this.cacheManager.set(`user-${user.id}`, user);

      next();
    } catch (error) {
      console.log(error);
    }
  }
}
