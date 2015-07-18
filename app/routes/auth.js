//var User = require('./models/user');

module.exports = function(router, passport) {
    //localhost:3000/auth
    router.get('/', function(req, res) {
        res.render('index.ejs');
    });

    //localhost:3000/auth/login
    router.get('/login', function(req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //localhost:3000/auth/signup
    router.get('/signup', function(req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')} );
    });
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    
    // Facebook auth login - route: - localhost:3000/auth/signup
    router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

	router.get('/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


    // Google Auth Login
    router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
	router.get('/google/callback',
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


    // Routes if user is already signed in with one or other acct
    router.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
	router.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));
	router.get('/connect/local', function(req, res){
		res.render('connect-local.ejs', { message: req.flash('signupMessage')});
	});

	router.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));

    // Unlink Social-Accts
    router.get('/unlink/facebook', function(req, res){
		var user = req.user;
		user.facebook.token = null;
		user.save(function(err){
			if(err)
				throw err;
			res.redirect('/profile');
		})
	});

	router.get('/unlink/local', function(req, res){
		var user = req.user;
		user.local.username = null;
		user.local.password = null;
		user.save(function(err){
			if(err)
				throw err;
			res.redirect('/profile');
		});

	});

	router.get('/unlink/google', function(req, res){
		var user = req.user;
		user.google.token = null;
		user.save(function(err){
			if(err)
				throw err;
			res.redirect('/profile');
		});
	});


    // Logout
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};
