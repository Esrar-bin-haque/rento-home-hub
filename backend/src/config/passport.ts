import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env.js';
import { findUserById, findUserByGoogleId, findUserByEmail, upsertGoogleUser } from '../services/auth.service.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || null;
        
        if (!email) {
          return done(new Error('Google account has no email address') as any);
        }

        if (!profile.displayName) {
          return done(new Error('Google account has no profile name') as any);
        }

        let user = findUserByGoogleId(profile.id);
        
        if (user) {
          return done(null, user);
        }

        user = findUserByEmail(email);
        if (user) {
          return done(null, user);
        }

        const newUser = await upsertGoogleUser({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  const user = findUserById(id);
  done(null, user);
});

export default passport;