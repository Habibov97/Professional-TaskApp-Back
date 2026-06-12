import { registerAs } from '@nestjs/config';

export default registerAs('jwtRefresh', () => ({
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: process.env.REFRESH_JWT_EXPIRE_IN as any,
  cookieAge: process.env.REFRESH_JWT_COOKIE_MAX_AGE as any,
}));
