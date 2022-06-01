const selectAll = (user, limit) =>
	`SELECT * FROM transactions WHERE deletedAt IS NULL AND user = "${user}" ORDER BY createdAt DESC ${
		limit ? `LIMIT ${LIMIT}` : ''
	}`;

const insert = ({ id, createdAt, concept, amount, type, user }) =>
	`INSERT INTO transactions( id, createdAt, concept, amount, type, user ) VALUES( "${id}", "${createdAt}", "${concept}", ${amount}, "${type}", "${user}" )`;

const remove = ({ id, deletedAt }) =>
	`UPDATE transactions SET deletedAt = "${deletedAt}" WHERE id = "${id}"`;

const select = id =>
	`SELECT * FROM transactions WHERE id = "${id}" AND deletedAt IS NULL`;

const update = ({ id, updatedAt, ...rest }) => {
	console.log(rest);
	const formattedFields = Object.entries(rest).map(
		([key, value]) => ` ${key} = "${value}"`
	);
	return `UPDATE transactions SET ${formattedFields}, modifiedAt = "${updatedAt}" WHERE id = "${id}"`;
};

const getBalance = user =>
	`SELECT SUM(amount) as balance FROM transactions WHERE user = "${user}"`;

module.exports = {
	selectAll,
	insert,
	remove,
	select,
	update,
	getBalance,
};
