import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { MainUpdate } from './updates/main.update';
import { CommandUpdate } from './updates/commands.updates';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMAS } from '../constants';
import { HistorySchema, StatsSchema, UserSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SCHEMAS.HISTORY, schema: HistorySchema },
      { name: SCHEMAS.LOGS, schema: StatsSchema },
      { name: SCHEMAS.USER, schema: UserSchema },
    ]),
  ],
  controllers: [TelegramController],
  providers: [MainUpdate, CommandUpdate, TelegramService],
})
export class TelegramModule {}
