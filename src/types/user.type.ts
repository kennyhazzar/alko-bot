export class IUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: true;
}

export class UserDefinition extends IUser {
  ban: boolean;
  role: Role;
}

export type Role = 'user' | 'admin';
