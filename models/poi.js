"use strict";
module.exports = (sequelize, DataTypes) => {
  const POI = sequelize.define(
    "POI",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      lat: {
        type: DataTypes.FLOAT(10, 6),
        allowNull: false
      },
      lng: {
        type: DataTypes.FLOAT(10, 6),
        allowNull: false
      },
      image: DataTypes.STRING,
      url: DataTypes.STRING,
      creatorId: DataTypes.STRING
    },
    {}
  );
  POI.associate = function(models) {
    // associations can be defined here
    POI.belongsToMany(models.Category, {
      through: "POICategory"
    });
    POI.belongsTo(models.Status, { foreignKey: "statusId" });
    POI.belongsTo(models.GPXFile, { foreignKey: "gpxFileId" });
  };
  return POI;
};
