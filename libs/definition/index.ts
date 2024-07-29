/* eslint-disable @typescript-eslint/no-namespace */
namespace Definition {
  export enum AdminRole {
    Default = 1,
    Super,
  }

  export enum Cookies {
    CsrfToken = 'lcsrl',
    AdminAuthToken = 'loper-auth-tk',
    AdminAuthTokenSig = 'loper-auth-tk.sig',
    UserAuthToken = 'lope-auth-tk',
    UserAuthTokenSig = 'lope-auth-tk.sig',
  }

  export enum RateLimit {
    AdminLogin = 5,
    Concordance = 15,
  }
}

export default Definition;
