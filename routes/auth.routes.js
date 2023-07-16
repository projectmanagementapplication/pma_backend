const authController = require('../controller/auth.controllers');
const { verifySignup, authJwt } = require('../middlewares');

module.exports = function(app) {
	// the below is for signup api
	app.post('/pma/api/v1/auth/signup', [ verifySignup.validateSignUpRequest ], authController.signUp);

	// the below is for signin api
	app.post('/pma/api/v1/auth/signin', authController.signIn);
	app.post('/pma/api/v1/auth/forgetPassword', authController.forgetPassword);
	app.post('/pma/api/v1/auth/resetPassword', authController.resetPassword);
	app.get('/pma/api/v1/auth/verifyToken/:token', authController.verifyToken);
};
