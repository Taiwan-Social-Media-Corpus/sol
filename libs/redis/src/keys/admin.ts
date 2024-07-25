export type AdminRedisKeyAction = { kind: 'emailRate'; email: string };

export const getAdminRedisKey = (action: AdminRedisKeyAction) => {
  switch (action.kind) {
    case 'emailRate':
      return `rate-limit:admin:login:${action.email}`;
    default:
      throw new Error('Invalid kind');
  }
};
