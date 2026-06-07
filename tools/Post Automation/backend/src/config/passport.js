const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
require('dotenv').config();

// Get backend URL from environment, default to localhost for development
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// LinkedIn Strategy - Disabled for Manual Posting Flow
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/linkedin/callback`,
        scope: ['openid', 'profile', 'email', 'w_member_social'],
        state: true
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            const user = {
                id: profile.id,
                displayName: profile.displayName,
                photos: profile.photos,
                email: profile.emails?.[0]?.value,
                accessToken: accessToken
            };
            return done(null, user);
        });
    }));
} else {
    console.log('[Auth] LinkedIn Strategy skipped (Missing Credentials)');
}

module.exports = passport;
