import { UpdateType } from 'telegraf/typings/telegram-types';

export class IStats {
  updateType: UpdateType;
  content: string;
  initiatorId: number;
  createdAt: number;
}
