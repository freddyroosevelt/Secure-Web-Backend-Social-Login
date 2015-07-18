var fs = require('fs');

module.exports = function(router, passport) {

    // Auth every request to make sure it has a valid token
    router.use(passport.authenticate('bearer', {session: false}));
    router.use(function(req, res, next) {
        // Logs the API usage or if API is being abuses its logged to logs.txt file
        fs.appendFile('logs.txt', req.path + " token " + req.query.access_token + "\n", function(err) {
            next();
        });
    });

    //Test API - Put API Info here
    router.get('/testAPI', function(req, res) {
        res.json({SecretData: 'Successfully Secured API'});
    });
}
