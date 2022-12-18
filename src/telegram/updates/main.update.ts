import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { COMMANDS, SCHEMAS } from '../../constants';
import { StatsDocument, UserDocument } from '../../schemas';

@Update()
export class MainUpdate {
  private isFirstStart = true;

  constructor(
    @InjectModel(SCHEMAS.USER) private userModel: Model<UserDocument>,
    @InjectModel(SCHEMAS.LOGS) private statsModel: Model<StatsDocument>,
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

      const user = await this.userModel.findOne({ id: ctx.from.id });

      if (!user) {
        await this.userModel.create({
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
          `Привет, ${
            ctx.from?.first_name
          }! Добро пожаловать в наше сообщество алкоголиков!\n\nСписок команд:\n${Object.keys(
            COMMANDS,
          )
            .map(
              (command, index) =>
                `${index + 1}. /${command} - ${
                  Object.values(COMMANDS)[index]
                }\n`,
            )
            .join('')}`,
        );

        return;
      }

      next();
    } catch (error) {
      console.log(error);
    }
  }
}
