// exports.userResponse = (users) => {
// 	let usersResult = [];
// 	users.forEach((user) => {
// 		usersResult.push({
// 			name: user.name,
// 			userName: user.userName,
// 			email: user.email,
// 			phone: user.phone,
// 			userType: user.userType
// 		});
// 	});

// 	return usersResult;
// };

exports.userResponse = (users) => {
	return users.map((user) => ({
		name: user.name,
		userName: user.userName,
		email: user.email,
		userType: user.userType,
		phone: user.phone,
		image: user.image
	}));
};
