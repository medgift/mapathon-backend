"use strict";
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "Like",
    {
      userId: DataTypes.STRING
    },
    {}
  );
  Like.associate = function(models) {
    // associations can be defined here
    Like.belongsTo(models.POI);
  };
  return Like;
};
