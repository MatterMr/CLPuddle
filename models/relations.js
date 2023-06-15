module.exports = function (models) {
	const Users = models.user;
	const Pools = models.pool;

	Users.hasMany(Pools, {
		onDelete: 'CASCADE',
	});
	Pools.belongsTo(Users);
};
