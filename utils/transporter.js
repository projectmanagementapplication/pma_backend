const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'p2290224@gmail.com',
		pass: 'wubninwbkskhugjm'
	},
	port: 465,
	host: 'smtp.gmail.com'
});
module.exports = transporter;
