const projectController = require('../controller/project.controllers');
module.exports = function(app) {
	// the below is for signup api
	app.post('/pma/api/v1/project/createpro', projectController.createProject);

	app.post('/pma/api/v1/project/deletepro', projectController.deleteProject);

	app.post('/pma/api/v1/project/updatepro', projectController.updateProject);

	app.get('/pma/api/v1/project/fetchallpro', projectController.fetchAllProjects);

	app.get('/pma/api/v1/project/:id', projectController.fetchProject);
};
