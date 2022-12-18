export class IUser {
  id?: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: true;
}

export class UserDefinition extends IUser {
  chatId?: number;
  typeOfChat?: string;
  ban?: boolean;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserIdsDefinition implements UserDefinition {
  id?: number;
  chatId?: number;
}

export type Role = 'user' | 'admin';
