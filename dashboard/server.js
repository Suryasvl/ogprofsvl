
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Dashboard configuration
const config = {
    client: {
        id: process.env.DISCORD_CLIENT_ID,
        secret: process.env.DISCORD_CLIENT_SECRET
    },
    bot: {
        token: process.env.DISCORD_BOT_TOKEN
    },
    dashboard: {
        domain: process.env.DASHBOARD_DOMAIN || 'http://localhost:5000',
        port: PORT
    }
};

// Session configuration
app.use(session({
    secret: 'dashboard-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Passport configuration
passport.use(new DiscordStrategy({
    clientID: config.client.id,
    clientSecret: config.client.secret,
    callbackURL: `${config.dashboard.domain}/auth/discord/callback`,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication middleware
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/discord');
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { 
        user: req.user,
        guilds: req.user.guilds || []
    });
});

app.get('/dashboard/guild/:id', ensureAuthenticated, (req, res) => {
    const guildId = req.params.id;
    // Load guild configuration
    const configPath = path.join(__dirname, '..', 'config.json');
    let guildConfig = {};
    
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        guildConfig = config.guilds?.[guildId] || {};
    }
    
    res.render('guild-dashboard', { 
        user: req.user,
        guildId: guildId,
        config: guildConfig
    });
});

// Auth routes
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => res.redirect('/dashboard')
);

app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

// API routes for configuration
app.post('/api/guild/:id/config', ensureAuthenticated, (req, res) => {
    const guildId = req.params.id;
    const { prefix, automod } = req.body;
    
    const configPath = path.join(__dirname, '..', 'config.json');
    let config = { guilds: {} };
    
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    if (!config.guilds) config.guilds = {};
    if (!config.guilds[guildId]) config.guilds[guildId] = {};
    
    if (prefix) config.guilds[guildId].prefix = prefix;
    if (automod) config.guilds[guildId].automod = automod;
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    res.json({ success: true, message: 'Configuration updated' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Dashboard running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
