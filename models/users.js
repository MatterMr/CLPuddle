module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'user',
		{
			discordId: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			osuId: {
				type: DataTypes.INTEGER,
				unique: true,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		}
	);
};
