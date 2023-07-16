const userController = require('../controller/user.controllers');
const authJwt = require('../middlewares/authJwt');

module.exports = function(app) {
	app.put('/pma/api/v1/update', userController.update);
	app.put('/pma/api/v1/updateProfile/:userId', userController.updateProfile);
	app.post('/pma/api/v1/delete', userController.delete);
	app.get('/crm/api/v1/users/:userId', userController.findById);

	// below is for admin routes
	// app.get('/crm/api/v1/users/', [ authJwt.verifyToken, authJwt.isAdmin ], userController.findAll);
	// app.get('/crm/api/v1/users/:userId', [ authJwt.verifyToken, authJwt.isAdmin ], userController.findById);
	// app.put('/crm/api/v1/users/update/:userId', [ authJwt.verifyToken, authJwt.isAdmin ], userController.update);
};
