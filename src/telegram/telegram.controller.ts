import { Controller, Get, Redirect } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf/dist/decorators';
import { Context, Telegraf } from 'telegraf';

@Controller()
export class TelegramController {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  @Redirect()
  @Get()
  redirectToBot() {
    return {
      url: `https://t.me/${this.bot.botInfo.username}`,
    };
  }
}
