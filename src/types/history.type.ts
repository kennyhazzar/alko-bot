import { UserDefinition } from './user.type';

export class IHistory {
  id?: number;
  chatId?: number;
  volume?: number;
  name?: string;
}

export class HistoryEntityResult extends UserDefinition {
  result: number;
}
