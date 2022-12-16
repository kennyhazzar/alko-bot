import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { Document } from 'mongoose';
import { IHistory } from '../types';

export type HistoryDocument = IHistory & Document;

@Schema()
export class History {
  @Prop({ isRequired: true, unique: true, type: Number })
  id: number;
  @Prop({ isRequired: true, unique: false, type: Number })
  volume: number;
  @Prop({ isRequired: false, unique: false, type: String })
  name?: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
