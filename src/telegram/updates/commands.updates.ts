import { Command, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { COMMANDS } from '../../constants';

@Update()
export class CommandUpdate {
  @Command(COMMANDS.start)
  async start(ctx: Context) {
    ctx.reply('start');
  }
}
