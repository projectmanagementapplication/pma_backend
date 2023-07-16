const User = require('../model/user.model');
const convertUserObject = require('../utils/convertUserObject');

exports.findAll = async (req, res) => {
	try {
		let users = await User.find();
		if (users) {
			return res.status(200).send(convertUserObject.userResponse(users));
		}
	} catch (err) {
		return res.status(500).send({
			message: 'Some internal error occured'
		});
	}
};

exports.findById = async (req, res) => {
	const userNameRequest = req.params.userId;

	const user = await User.find({
		userName: userNameRequest
	});
	if (user.length > 0) {
		return res.status(200).send(convertUserObject.userResponse(user));
	} else {
		return res.status(200).send({
			message: `User with userName ${userNameRequest} is not present`
		});
	}
};

exports.update = async (req, res) => {
	const userNameReq = req.body.userName;

	try {
		const user = await User.findOneAndUpdate(
			{
				userName: userNameReq
			},
			{
				userName: req.body.userName,
				name: req.body.name,
				phone: req.body.phone,
				email: req.body.email
			}
		).exec();

		if (user) {
			return res.status(200).send({
				message: 'User updated successfully'
			});
		}
	} catch (err) {
		res.status(500).send({
			message: 'Some internal server error occured'
		});
	}
};

exports.delete = async (req, res) => {
	// for delete the below code to be checked again
	const token = req.rawHeaders;

	if (token) {
		await jwt.verify(token[1].substr(7), authConfig.secretKey, {}, async (err, userData) => {
			if (err) throw err;
			const respo = await User.deleteOne({
				userName: userData.Id
			});
			if (respo.deletedCount > 0) {
				res.status(200).send({
					message: 'deleted Successfully'
				});
			} else {
				res.status(400).send({
					message: 'deletion not Successfully'
				});
			}
		});
	}
};
exports.updateProfile = async (req, res, next) => {
	const userId = req.params.userId;
	const user = await User.findOne({ userName: userId });
	const fileName = req.file;
	const imageUrl = fileName.path;
	let a = 1;
	let st = '';
	for (let i = 0; i < imageUrl.length; i++) {
		if (a == 0) {
			st = st + imageUrl[i];
		} else if (imageUrl[i] === 's') {
			i++;
			a = 0;
		}
	}
	user.image = st;
	await user.save();
	res.status(200).send({
		message: 'hello'
	});
};
