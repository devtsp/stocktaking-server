const selectAll = () =>
	'SELECT * FROM transactions WHERE deletedAt IS NULL ORDER BY createdAt DESC';

const insert = ({ id, createdAt, concept, amount, type }) =>
	`INSERT INTO transactions( id, createdAt, concept, amount, type ) VALUES( "${id}", "${createdAt}", "${concept}", ${amount}, "${type}" )`;

const remove = ({ id, deletedAt }) =>
	`UPDATE transactions SET deletedAt = "${deletedAt}" WHERE id = '${id}'`;

const select = id =>
	`SELECT * FROM transactions WHERE id = "${id}" AND deletedAt IS NULL`;

const update = ({ id, validFields, updatedAt }) => {
	const formattedFields = validFields.map(
		([key, value]) => ` ${key} = "${value}"`
	);
	return `UPDATE transactions SET ${formattedFields}, modifiedAt = "${updatedAt}" WHERE id = "${id}"`;
};

const getBalance = () => 'SELECT SUM(amount) as balance FROM transactions';

module.exports = {
	selectAll,
	insert,
	remove,
	select,
	update,
	getBalance,
};
