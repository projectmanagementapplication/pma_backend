const transporter = require('../utils/transporter');
exports.contactUs = async (req, res) => {
	try {
		const userName = req.params.userId;
		const { name, email, message } = req.body;
		try {
			await transporter.sendMail({
				from: 'p2290224@gmail.com',
				to: 'p2290224@gmail.com',
				subject: `ContactUs Form Data`,
				html: `
              <h1> ContactUs Form Data from ${email}</h1>
              <div>
			<h3> Name : ${name}</h3> 
			<h3> Username : ${userName}</h3> 
			<h3> Email : ${email}</h3> 
			<h3> Message : ${message}</h3> 
			  </div>
            `
			});
			res.status(200).send({ message: 'Email sent successfully' });
		} catch (error) {
			res.status(500).send({ message: 'Internal server error occurred while sending email' });
		}
	} catch (error) {
		// Send an error response with the specific error message
		return res.status(500).send({
			message: 'An internal error occurred while creating the message',
			error: error.message
		});
	}
};
