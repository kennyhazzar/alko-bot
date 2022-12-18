export const generateToken = (
  length = 700,
  alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
) => {
  const a = alphabet.split('');
  const token = [];
  for (let i = 0; i < length; i++) {
    const instance = (Math.random() * (a.length - 1)).toFixed(0);
    token[i] = a[instance];
  }
  return token.join('');
};
