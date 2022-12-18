import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { isNumberString } from 'class-validator';
import { Command, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { COMMANDS_DEFINITION } from '../../constants';
import { greetingNewUser } from '../../messages';
import { IHistory } from '../../types';
import { TelegramService } from '../telegram.service';

@Update()
export class CommandUpdate {
  constructor(
    private telegramService: TelegramService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Command(COMMANDS_DEFINITION.START)
  async start(ctx: Context) {
    ctx.reply(greetingNewUser(ctx.from?.first_name || ctx.from?.username));
  }

  @Command(COMMANDS_DEFINITION.BEER)
  async beer(ctx: Context) {
    const payload: IHistory = { id: ctx.from.id };

    const message = ((ctx.message as any)?.text as string).split(' ');

    if (
      isNumberString(message[1]) ||
      isNumberString(message[1].replace(',', '.'))
    ) {
      if (Number(message[1].replace(',', '.')) < 0) {
        ctx.reply('Вы не можете использовать отрицательные числа!');

        return;
      }

      payload.volume = Number(message[1].replace(',', '.'));
    }

    if (ctx.chat.type !== 'private') {
      payload.chatId = ctx.chat.id;
    }

    if (message.length > 2) {
      payload.name = message[2];
    }

    try {
      await this.telegramService.createHistory(payload);

      await ctx.reply(
        `${ctx.from?.first_name || ctx.from.username}, вы выпили ${
          message[1]
        } литров ${message.length > 2 ? `марки ${message[2]}` : ''}`,
      );

      return;
    } catch (error) {
      console.log(error);
      await ctx.reply('Произошла ошибка при создании');
    }
  }

  @Command(COMMANDS_DEFINITION.STATS)
  async getStats(ctx: Context) {
    if (ctx.chat.type !== 'private') {
      const stats = await this.telegramService.getStats({
        chatId: ctx.chat.id,
      });

      if (stats.length === 0) {
        await ctx.reply('Пока никто не выпил в этой группе');

        return;
      }

      ctx.reply(
        stats
          .sort((a, b) => b.result - a.result)
          .map(
            (item, index) =>
              `${index + 1}. ${(item as any)?._doc?.username} - ${
                item.result
              } литров\n`,
          )
          .join(''),
      );

      return;
    }

    const stats = await this.telegramService.getStats({ id: ctx.from.id });

    if (stats.length === 0) {
      await ctx.reply('Пока никто не выпил в этой группе');

      return;
    }

    ctx.reply('дебаг');
  }
}
