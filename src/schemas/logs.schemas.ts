import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UpdateType } from 'telegraf/typings/telegram-types';
import { IStats } from '../types';

export type StatsDocument = IStats & Document;

@Schema()
export class Logs {
  @Prop({ required: false, type: String })
  updateType: UpdateType;
  @Prop({ required: false, type: String })
  content: string;
  @Prop({ required: false, type: Number })
  initiatorId: number;
  @Prop({ required: false, type: Number })
  createdAt: number;
}

export const StatsSchema = SchemaFactory.createForClass(Logs);
