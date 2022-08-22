module.exports = function(sequelize, DataTypes) {
	return sequelize.define('pools', {
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
	}, {
		timestamps: true,
		updatedAt: false,
	});
};
