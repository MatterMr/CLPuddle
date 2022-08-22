module.exports = function(models) {
	const Users = models.get('users');
	const Pools = models.get('pools');

	Users.hasMany(Pools, {
		onDelete: 'CASCADE',
	});
	Pools.belongsTo(Users);
};