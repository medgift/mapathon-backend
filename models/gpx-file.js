"use strict";
module.exports = (sequelize, DataTypes) => {
  const GPXFile = sequelize.define(
    "GPXFile",
    {
      path: DataTypes.STRING,
      url: DataTypes.STRING,
      group: DataTypes.INTEGER,
      creatorId: DataTypes.STRING
    },
    {}
  );
  GPXFile.associate = function(models) {
    // associations can be defined here
    GPXFile.hasOne(models.POI, { foreignKey: "gpxFileId" });
  };
  return GPXFile;
};
