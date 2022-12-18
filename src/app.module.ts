import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { SCHEMAS } from './constants';
import { HistorySchema, StatsSchema, UserSchema } from './schemas';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: SCHEMAS.USER, schema: UserSchema },
      { name: SCHEMAS.HISTORY, schema: HistorySchema },
      { name: SCHEMAS.LOGS, schema: StatsSchema },
    ]),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
