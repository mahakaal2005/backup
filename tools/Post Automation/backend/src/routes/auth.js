const express = require('express');
const passport = require('passport');
const router = express.Router();

// Get frontend URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Redirect to LinkedIn for authentication
router.get('/linkedin',
    passport.authenticate('linkedin', { state: true }) // state: true is important for security
);

// Callback after LinkedIn authentication
router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        failureRedirect: `${FRONTEND_URL}/settings?error=auth_failed`
    }),
    (req, res) => {
        // Successful authentication
        // In a real app, you might issue a JWT here. 
        // For now, we'll rely on the session or pass a flag back to the frontend.

        // Redirect back to frontend settings page
        res.redirect(`${FRONTEND_URL}/settings?connected=true`);
    }
);

// Get current user status (check if connected)
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            connected: true,
            user: {
                name: req.user.displayName,
                avatar: req.user.photos?.[0]?.value
            }
        });
    } else {
        res.json({ connected: false });
    }
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.json({ success: true });
    });
});

module.exports = router;
