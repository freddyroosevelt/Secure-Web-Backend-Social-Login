var User = require('../models/user').User;
var Token = require('../models/user').Token;

module.exports = function(router, passport) {
    router.use(function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/auth');
    });

    // Add Profile.ejs to secured routes
    router.get('/profile', function(req, res) {
        User.findOne({_id: req.user._id}).populate('token').exec(function(err, user) {
            res.render('profile.ejs', {user: user});
        });

        //res.render('secured/profile.ejs', {user: req.user});
        //res.render('profile.ejs', {user: req.user});
    });

    // Add Home.ejs to secured routes
    /*router.get('/home', function(req, res) {
        res.render('secured/home.ejs');
    });*/


    // User Token Schema
    router.get('/getToken', function(req, res) {
        User.findOne({_id: req.user._id}).populate('token').exec(function(err, user) {
            if(user.token == null)
                user.generateToken();
            res.user = user;
            res.redirect('/profile');
        });
    });



    // Catch all Route - any 404 error
    router.get('/*', function(req, res) {
        res.redirect('/profile');
    });
}
