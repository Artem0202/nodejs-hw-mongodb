import { randomBytes } from 'node:crypto';
import { sessioCollection } from '../db/models/session.js';
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from '../constants/index.js';

export const createSession = (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

  return sessioCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};
