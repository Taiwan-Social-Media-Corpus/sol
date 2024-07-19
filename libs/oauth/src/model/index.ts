import { google } from 'googleapis';
import { env } from '@sol/env';

const OAuthClient = new google.auth.OAuth2({
  redirectUri: `${env.serverURL}/v1/user/auth/callback`,
  clientSecret: env.googleOAuthClientSecret,
  clientId: env.googleOAuthClientId,
});

export default OAuthClient;
