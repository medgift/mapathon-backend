"use strict";
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      path: DataTypes.STRING,
      url: DataTypes.STRING,
      creatorId: DataTypes.STRING
    },
    {}
  );
  File.associate = function(models) {
    // associations can be defined here
    File.hasOne(models.POI, { foreignKey: "fileId" });
  };
  return File;
};
