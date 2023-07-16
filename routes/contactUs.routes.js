const contactUsController = require('../controller/contactUs.controllers');

module.exports = function(app) {
	app.post('/pma/api/v1/contactUs/:userId', contactUsController.contactUs);
};
