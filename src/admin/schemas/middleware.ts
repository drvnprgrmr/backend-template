import { PreSaveMiddlewareFunction } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AdminDocument } from './admin.schema';

export const preSave: PreSaveMiddlewareFunction<AdminDocument> =
  async function (next) {
    try {
      const paths = ['password'];

      for (const path of paths) {
        if (this.isModified(path))
          this.set(path, await bcrypt.hash(this.get(path), 10));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
