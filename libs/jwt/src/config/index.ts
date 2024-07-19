import { env } from '@sol/env';

export const jwk = {
  publicKey: {
    crv: 'Ed25519',
    x: env.jwkPublicX,
    kty: 'OKP',
  },
  privateKey: {
    crv: 'Ed25519',
    d: env.jwkPrivateD,
    x: env.jwkPublicX,
    kty: 'OKP',
  },
} as const;
