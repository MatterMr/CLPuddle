module.exports = function(sequelize, DataTypes) {
	return sequelize.define('pools', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: true,
		updatedAt: false,
	});
};
