var express = require("express");
var router = express.Router();

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
router.get("/", function(req, res, next) {
  let response = {
    data: ["a POI"]
  };

  res.send(response);
});

module.exports = router;
