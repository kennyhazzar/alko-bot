import { Schema } from '@nestjs/mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose/dist';
import { Document, now } from 'mongoose';
import { Role, UserDefinition } from '../types';

export type UserDocument = UserDefinition & Document;

@Schema()
export class User {
  @Prop({ isRequired: true, unique: true, type: Number })
  id: number;
  @Prop({ isRequired: true, unique: true, type: Number })
  chatId: number;
  @Prop({ isRequired: true, unique: false, type: Boolean })
  is_bot: boolean;
  @Prop({ isRequired: true, unique: false, type: String })
  first_name: string;
  @Prop({ isRequired: false, unique: false, type: String })
  last_name?: string;
  @Prop({ isRequired: false, unique: true, type: String })
  username?: string;
  @Prop({ isRequired: false, unique: false, type: String })
  language_code?: string;
  @Prop({ isRequired: false, unique: false, type: Boolean })
  is_premium?: true;
  @Prop({ isRequired: true, unique: false, type: Boolean, default: false })
  ban: boolean;
  @Prop({ isRequired: true, unique: false, type: String, default: 'user' })
  role: Role;
  @Prop({ isRequired: true, unique: false, type: String })
  typeOfChat?: string;
  @Prop({ default: now() })
  createdAt?: Date;
  @Prop({ default: now() })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
