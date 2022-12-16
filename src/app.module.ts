import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorySchema, UserSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'History', schema: HistorySchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
