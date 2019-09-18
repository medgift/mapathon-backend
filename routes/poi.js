var express = require("express");
var router = express.Router();
var models = require("../models");

/**
 * @swagger
 * tags:
 *  name: POI
 *  description: All routes concerning POIs (listing, creating, etc.)
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    POI:
 *      type: object
 *      properties:
 *        description:
 *          type: string
 */

/**
 * @swagger
 * /poi:
 *   get:
 *     tags:
 *      - POI
 *     description: Returns all POIs
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: pois
 *         schema:
 *          $ref: '#/components/schemas/POI'
 */
router.get("/", async function(req, res, next) {
  let pois = await models.POI.findAll({
    include: [models.User, models.Status, models.Category, models.Tag]
  });

  let response = {
    data: pois
  };

  res.send(response);
});

module.exports = router;
