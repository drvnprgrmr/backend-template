import { PreSaveMiddlewareFunction } from 'mongoose';
import { UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

export const preSave: PreSaveMiddlewareFunction<UserDocument> = async function (
  next,
) {
  try {
    const paths = ['password', 'wallet.pin'];

    for (const path of paths) {
      if (this.isModified(path))
        this.set(path, await bcrypt.hash(this.get(path), 10));
    }

    next();
  } catch (err) {
    next(err);
  }
};
