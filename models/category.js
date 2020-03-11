"use strict";
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      creatorId: DataTypes.STRING
    },
    {}
  );
  Category.associate = function(models) {
    // associations can be defined here
    Category.belongsToMany(models.POI, { through: "POICategory" });
  };
  return Category;
};
