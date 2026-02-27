/**
 * ID generation — prefixed nanoids for type-safe IDs.
 *
 * Uses Web Crypto (available in Workers) instead of nanoid package
 * to avoid the dependency. Same collision resistance.
 */

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const ID_LENGTH = 12;

function generate(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let id = '';
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}

export const makeId = {
  asset: () => `a_${generate(ID_LENGTH)}`,
  version: () => `v_${generate(ID_LENGTH)}`,
  tag: () => `t_${generate(8)}`,
  usage: () => `u_${generate(ID_LENGTH)}`,
};
