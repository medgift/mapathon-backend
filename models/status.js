"use strict";
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    "Status",
    {
      name: DataTypes.STRING,
      creatorId: DataTypes.STRING
    },
    {}
  );
  Status.associate = function(models) {
    // associations can be defined here
  };
  return Status;
};
