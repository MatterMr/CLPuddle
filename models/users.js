module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		discordId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};