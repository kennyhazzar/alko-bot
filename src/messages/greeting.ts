import { COMMANDS } from '../constants';

export const greetingNewUser = (firstName: string) => {
  return `Привет, ${firstName}! Добро пожаловать в наше сообщество алкоголиков!\n\nСписок команд:\n${Object.keys(
    COMMANDS,
  )
    .map(
      (command, index) =>
        `${index + 1}. /${command} - ${Object.values(COMMANDS)[index]}\n`,
    )
    .join('')}`;
};
