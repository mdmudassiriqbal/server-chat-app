const jwt = require('jsonwebtoken');

const getToken = rawData => {
	return new Promise(async (resolve, reject) => {
		try {
			if (typeof rawData === 'object' && !Array.isArray(rawData)) {
				const jwtData = {
					data: rawData,
				};
				const token = await jwt.sign(jwtData, 'my@chat@pp');
				
				resolve(token);
			}
			throw new Error('Data not found');
		} catch (err) {
			reject(err);
		}
	});
};
const verifyToken = token => {
	return new Promise((resolve, reject) => {
		try {
			const decoded = jwt.verify(token, 'my@chat@pp');
			resolve(decoded);
		} catch (err) {
			reject({ message: 'Unauthorized access' });
		}
	});
};

module.exports = {
	getToken,
	verifyToken,
};