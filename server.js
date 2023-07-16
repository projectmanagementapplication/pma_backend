// importing mongoose for establishing connection with database
const mongoose = require('mongoose');

// importing cors
const cors = require('cors');

// the below is for all configuration code
const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');

// importing multer to receive files from client
const multer = require('multer');

// the below is for bcrypt js i.e., used to encrypt and decrypt text (ex. password)
const bcrypt = require('bcryptjs');

// express settings
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// importing User model below
const User = require('./model/user.model');
// the all below code is for creating db and connecting
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;

db.on('error', () => {
	console.log(`Error while connecting to Database with ${dbConfig.DB_NAME}!`);
});

db.once('open', () => {
	console.log(`Connected to Database Successfully with ${dbConfig.DB_NAME}!`);
	init();
});

// for admin creation
async function init() {
	let user = await User.findOne({ userName: 'ADMIN' });
	if (user) {
		console.log(`Admin user already Present!`);
		return;
	}
	try {
		// creating the user
		user = await User.create({
			name: 'Jayesh Chauhan',
			userName: 'ADMIN',
			email: 'p2290224@gmail.com',
			phone: 8273798510,
			userType: 'ADMIN',
			password: await bcrypt.hashSync('Welcome@1234', 15)
		});
		console.log(user);
	} catch (error) {
		console.log(`Error while creating Admin User and the error is : ${error}`);
	}
}

// importing routes
require('./routes/auth.routes')(app);
require('./routes/project.routes')(app);
require('./routes/user.routes')(app);
require('./routes/contactUs.routes')(app);

// the below code is for initializing server
app.listen(serverConfig.PORT, () => {
	console.log(`Server is up and running on port : ${serverConfig.PORT}!`);
});
