import * as bcrypt from 'bcrypt';
import { AdminDocument } from './admin.schema';

type VerifyHash = (
  this: AdminDocument,
  path: string,
  plain: string,
) => Promise<boolean>;

export interface AdminMethods {
  verifyHash: VerifyHash;
}

const verifyHash: VerifyHash = async function (path, plain) {
  return await bcrypt.compare(plain, this.get(path));
};

export const adminMethods = [verifyHash];
