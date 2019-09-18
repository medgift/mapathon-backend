"use strict";
module.exports = (sequelize, DataTypes) => {
  const POI = sequelize.define(
    "POI",
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      lat: DataTypes.FLOAT(10, 6),
      lng: DataTypes.FLOAT(10, 6),
      image: DataTypes.STRING
    },
    {}
  );
  POI.associate = function(models) {
    // associations can be defined here
    POI.belongsTo(models.User, {
      modelName: "creator",
      foreignKey: "creatorId"
    });
    POI.belongsTo(models.Status, { foreignKey: "statusId" });
    POI.belongsTo(models.GPXFile, { foreignKey: "gpxFileId" });
    POI.belongsToMany(models.Tag, {
      through: "POITag"
    });
    POI.belongsToMany(models.Category, {
      through: "POICategory"
    });
  };
  return POI;
};
