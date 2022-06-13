const selectAll = (userId, limit) => {
	return `SELECT * FROM transactions WHERE deletedAt IS NULL AND transactionUserId = "${userId}" ORDER BY createdAt DESC ${
		limit ? `LIMIT ${limit}` : ''
	}`;
};

const insert = ({ id, createdAt, concept, amount, type, userId }) => {
	return `INSERT INTO transactions( id, createdAt, concept, amount, type, transactionUserId ) VALUES( "${id}", "${createdAt}", "${concept}", ${amount}, "${type}", "${userId}" )`;
};

const remove = ({ id, deletedAt }) => {
	return `UPDATE transactions SET deletedAt = "${deletedAt}" WHERE id = "${id}"`;
};

const select = id => {
	return `SELECT * FROM transactions WHERE id = "${id}" AND deletedAt IS NULL`;
};

const update = ({ id, modifiedAt, ...rest }) => {
	const formattedFields = Object.entries(rest).map(
		([key, value]) => ` ${key} = ${value != null ? `"${value}"` : `NULL`}`
	);
	return `UPDATE transactions SET ${formattedFields}, modifiedAt = "${modifiedAt}" WHERE id = "${id}" AND deletedAt IS NULL`;
};

const getBalance = userId => {
	return `SELECT SUM(amount) as balance FROM transactions WHERE transactionUserId = "${userId}" AND deletedAt IS NULL`;
};

module.exports = {
	selectAll,
	insert,
	remove,
	select,
	update,
	getBalance,
};
