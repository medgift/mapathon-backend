const path = require("path");
const models = require("../models");

module.exports = async () => {
  /* Load all achievement types */
  let normalizedPath = require("path").resolve(__dirname, "../data/populate");

  let modelFilePairs = {};

  // Read the files (synchronous)
  require("fs")
    .readdirSync(normalizedPath)
    .forEach(file => {
      let modelName = path.basename(file, ".json");
      modelFilePairs[modelName] = file;
    });

  // Sort models by dependencies
  let sortedModelNames = Object.keys(modelFilePairs).sort((modelA, modelB) => {
    if (modelA === "POI") return 1;
    else return modelA.localeCompare(modelB);
  });

  // Populate models (asynchronous)
  for (let modelName of sortedModelNames) {
    await populateData(modelFilePairs[modelName], modelName);
  }
};

async function populateData(dataFile, modelName) {
  console.log(`Populating ${modelName}...`);
  var data = require(`../data/populate/${dataFile}`);
  try {
    await models[modelName].bulkCreate(data);

    if (modelName === "POI") {
      // Associate POIs
      for (let poi of data) {
        await associateModelToPOI("categories", poi);
        await associateModelToPOI("tags", poi);
      }
    }
  } catch (err) {
    console.log(err);
    console.log(`Already populated ${modelName} `);
  }
}

async function associateModelToPOI(field, poi) {
  if (poi[field]) {
    let poiInstance = await models.POI.findByPk(poi.id);

    switch (field) {
      case "categories":
        poiInstance.setCategories(poi[field]);
        break;
      case "tags":
        poiInstance.setTags(poi[field]);
        break;
    }
  }
}
