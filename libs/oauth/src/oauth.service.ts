import { Injectable } from '@nestjs/common';
import OAuthClient from './model';

export type OAuthReturnedData = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};

@Injectable()
export class OAuthService {
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    return OAuthClient.generateAuthUrl({
      scope: scopes,
      access_type: 'offline',
    });
  }

  async getUser(code: string) {
    try {
      const { tokens } = await OAuthClient.getToken(code);
      OAuthClient.setCredentials(tokens);
      const result = await OAuthClient.request<OAuthReturnedData>({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });
      if (!result || !result.data) {
        return null;
      }
      return result.data;
    } catch (error) {
      return null;
    }
  }
}
