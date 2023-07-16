const constants = require('../utils/constants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
const transporter = require('../utils/transporter');
const crypto = require('crypto');
const User = require('../model/user.model');

// Function to hash the password
const hashPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(13);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		throw new Error('Error occurred while hashing the password');
	}
};

// Function to generate and sign JWT token
const generateAccessToken = async (userName) => {
	const token = await jwt.sign({ id: userName }, authConfig.secretKey, {
		expiresIn: 86400 // 24 hours
	});
	return token;
};

// Step 1: Sign up a user
exports.signUp = async (req, res) => {
	try {
		const { name, userName, email, phone, password } = req.body;
		console.log('signup API called by Jayesh');
		console.log(`${name}, ${userName}, ${email}, ${phone}, ${password}`);

		// Hash the password
		const hashedPassword = await hashPassword(password);
		console.log('Hashed password:', hashedPassword);

		// Create a new user in the database
		const createUser = new User({
			name,
			userName,
			email,
			phone,
			password: hashedPassword
		});

		await createUser.save();
		console.log('User created:', createUser);

		// Prepare response data
		const postResponse = {
			name: createUser.name,
			userName: createUser.userName,
			email: createUser.email,
			phone: createUser.phone,
			userType: createUser.userType,
			createdAt: createUser.createdAt,
			updatedAt: createUser.updatedAt
		};
		// Send the successful response
		return res.status(200).send({
			postResponse,
			message: 'Sign Up Successful'
		});
	} catch (error) {
		console.error('Error occurred while creating the user:', error);
		// Send an error response if an error occurred
		return res.status(500).send({
			message: 'Internal server error occurred while creating the user'
		});
	}
};

// Step 7: Sign in a user
exports.signIn = async (req, res) => {
	try {
		const { userName, email, password } = req.body;

		// Find the user by userName or email in the database
		const user = await User.findOne({ $or: [ { userName }, { email } ] });
		if (!user) {
			// Send an error response if the user doesn't exist
			return res.status(400).send({
				message: "Failed! User doesn't exist"
			});
		}

		// Check if the password matches
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			// Send an error response if the password is invalid
			return res.status(401).send({
				message: 'Invalid Password'
			});
		}

		// Generate and sign the JWT token
		const token = await generateAccessToken(user.userName);

		// Prepare response data
		const responseData = {
			name: user.name,
			userName: user.userName,
			email: user.email,
			phone: user.phone,
			userType: user.userType,
			accessToken: token
		};

		// Send the successful response
		res.status(200).send(responseData);
	} catch (error) {
		console.log('Error occurred while signing in the user');
		// Send an error response if an error occurred
		if (error.code === 11000 && error.keyPattern && error.keyPattern.username === 1) {
			return res.status(400).send({ message: 'Username already exists' });
		} else {
			return res.status(500).send({
				message: 'Some internal error occurred while signing in the user'
			});
		}
	}
};

exports.forgetPassword = async (req, res) => {
	try {
		const email = req.body.email;
		console.log(req.body);
		const user = await User.findOne({ email: email });

		if (user) {
			crypto.randomBytes(32, async (err, buffer) => {
				if (err) {
					console.log(err);
					return res.status(500).send({
						message: 'Internal server error occurred while generating token'
					});
				}

				const token = buffer.toString('hex');

				try {
					await transporter.sendMail({
						from: 'p2290224@gmail.com',
						to: email,
						subject: 'Reset Password',
						html: `
              <h1>You requested a password reset</h1>
              <h3>Click this <a href="http://localhost:3000/reset_password/${token}">link</a> to set a new password.</h3>
            `
					});
					user.resetToken = token;
					user.resetTokenExpiration = Date.now() + 300000;

					await user.save();

					res.status(200).send({ message: 'Email sent successfully' });
				} catch (error) {
					console.log(error);
					res.status(500).send({ message: 'Internal server error occurred while sending email' });
				}
			});
		} else {
			res
				.status(400)
				.send({ message: 'No user with this email present in the database. Please enter the correct email.' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Internal server error occurred while resetting password' });
	}
};

exports.resetPassword = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		console.log(req.body);
		const hashedPassword = await hashPassword(password);
		console.log('password', password);
		const user = await User.findOneAndUpdate(
			{
				email: email
			},
			{
				password: hashedPassword
			}
		).exec();

		if (user) {
			user.resetToken = undefined;
			user.resetTokenExpiration = undefined;
			await user.save();
			return res.status(200).send({
				message: 'Password updated successfully'
			});
		}
	} catch (err) {
		res.status(500).send({
			message: 'Some internal server error occured'
		});
	}
};
exports.verifyToken = async (req, res, next) => {
	const token = req.params.token;
	const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
	if (user) {
		res.status(200).send({ verified: true });
	} else {
		res.status(200).send({ verified: false });
	}
};
