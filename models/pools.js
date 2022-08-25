module.exports = function(sequelize, DataTypes) {
	return sequelize.define('pool', {
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
