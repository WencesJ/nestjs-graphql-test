import { createCipheriv, createDecipheriv, createHash } from 'crypto';

function aesEncrypt(value: string, secret: string) {
  const key = Buffer.from(secret.padEnd(32, '0').slice(0, 32));

  const iv = createHash('sha256').update(secret).digest().subarray(0, 16);

  const cipher = createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(value);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
}

function aesDecrypt(value: string, secret: string) {
  const encryptedValue = Buffer.from(value, 'hex');

  const key = Buffer.from(secret.padEnd(32, '0').slice(0, 32));

  const iv = createHash('sha256').update(secret).digest().subarray(0, 16);

  const decipher = createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encryptedValue);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export const cryptHelper = {
  aesEncrypt,
  aesDecrypt,
};
