const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;

passport.use(new TwitchStrategy({
    clientID: 'ed2iwwf2nnbxievqivcrha43gmt4j1',
    clientSecret: 'ujr30q88qvaf0akrvd8bwo8ue6sprq',
    callbackURL: 'https://carlinhos-bot.netlify.app/auth/twitch/callback', // Esta é a URL de callback
    scope: 'user:read:email' // Defina os escopos necessários
},
(accessToken, refreshToken, profile, done) => {
    // Aqui você pode armazenar as informações do usuário no banco de dados
    // e redirecionar de volta para o seu site
    return done(null, profile);
}));

app.get('/auth/twitch/callback',
    passport.authenticate('twitch', { failureRedirect: '/' }),
    (req, res) => {
        // Redirecione para a página principal ou a página desejada após a autenticação
        res.redirect('/');
    });

    const passport = require('passport');
const TwitchStrategy = require('passport-twitch-new').Strategy;

passport.use(new TwitchStrategy({
    clientID: 'ed2iwwf2nnbxievqivcrha43gmt4j1',
    clientSecret: 'ujr30q88qvaf0akrvd8bwo8ue6sprq',
    callbackURL: 'https://carlinhos-bot.netlify.app/auth/twitch/callback',
    scope: 'user:read:email' // Defina os escopos necessários
},
(accessToken, refreshToken, profile, done) => {
    // Aqui você pode armazenar as informações do usuário no banco de dados
    // e redirecionar de volta para o seu site
    return done(null, profile);
}));

// Configure suas rotas para autenticação e redirecionamento
app.get('/auth/twitch',
    passport.authenticate('twitch'));

app.get('/auth/twitch/callback',
    passport.authenticate('twitch', { failureRedirect: '/' }),
    (req, res) => {
        // Redirecione para a página principal ou a página desejada
        res.redirect('/');
    });


