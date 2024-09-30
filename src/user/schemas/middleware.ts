import { PreSaveMiddlewareFunction } from 'mongoose';
import { UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

function randomNumbers(length: number = 10) {
  const numbers = [];

  for (let i = 0; i < length; i++) numbers.push(crypto.randomInt(10));

  return numbers.join('');
}

export const preSave: PreSaveMiddlewareFunction<UserDocument> = async function (
  next,
) {
  try {
    const paths = ['password', 'wallet.pin'];

    for (const path of paths) {
      if (this.isModified(path))
        this.set(path, await bcrypt.hash(this.get(path), 10));
    }

    if (!this.get('username')) this.set('username', `user${randomNumbers()}`);

    next();
  } catch (err) {
    next(err);
  }
};
