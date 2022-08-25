module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		discordId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};