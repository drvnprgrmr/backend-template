import * as crypto from 'node:crypto';

export function randomNumbers(length: number = 10) {
  const numbers = [];

  for (let i = 0; i < length; i++) numbers.push(crypto.randomInt(10));

  return numbers.join('');
}
