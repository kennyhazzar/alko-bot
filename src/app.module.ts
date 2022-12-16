import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { HistorySchema, UserSchema } from './schemas';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'History', schema: HistorySchema },
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
