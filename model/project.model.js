const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	projectId: {
		type: String,
		required: true,
		unique: true,
		default: Data.now()
	},
	name: {
		type: String,
		required: true
	},
	projectCategory: {
		type: String,
		required: true,
		default: 'General'
	},
	createdAt: {
		type: Date,
		immutable: true,
		default: () => {
			return Date.now();
		}
	},
	updatedAt: {
		type: Date,
		default: () => {
			return Date.now();
		}
	}
});

module.exports = mongoose.model('Project', projectSchema);
