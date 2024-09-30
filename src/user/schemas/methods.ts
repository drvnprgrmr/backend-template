import { UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

type VerifyHash = (
  this: UserDocument,
  path: string,
  plain: string,
) => Promise<boolean>;

type GenerateNonce = (
  this: UserDocument,
  length?: number,
  expiresIn?: number,
) => Promise<string>;

type VerifyNonce = (
  this: UserDocument,
  nonce: string,
) => Promise<boolean | 'expired'>;

export interface UserMethods {
  verifyHash: VerifyHash;
  generateNonce: GenerateNonce;
  verifyNonce: VerifyNonce;
}

const verifyHash: VerifyHash = async function (path, plain) {
  return await bcrypt.compare(plain, this.get(path));
};

const generateNonce: GenerateNonce = async function (
  length = 6,
  expiresIn = 10 * 60 * 1_000,
) {
  const nonce = crypto.randomBytes(length).toString('hex').slice(0, length);

  this.nonce = {
    value: await bcrypt.hash(nonce, 10),
    expiresAt: new Date(Date.now() + expiresIn),
  };

  await this.save();

  return nonce;
};

const verifyNonce: VerifyNonce = async function (nonce) {
  if (!this.nonce.value) return false;

  const now = new Date();

  if (now >= this.nonce.expiresAt) {
    this.nonce.value = '';

    await this.save();

    return 'expired';
  }

  return await bcrypt.compare(nonce, this.nonce.value);
};

export const userMethods = [verifyHash, generateNonce, verifyNonce];
