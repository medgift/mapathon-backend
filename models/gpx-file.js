"use strict";
module.exports = (sequelize, DataTypes) => {
  const GPXFile = sequelize.define(
    "GPXFile",
    {
      path: DataTypes.STRING,
      url: DataTypes.STRING
    },
    {}
  );
  GPXFile.associate = function(models) {
    // associations can be defined here
  };
  return GPXFile;
};
