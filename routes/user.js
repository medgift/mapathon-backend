var express = require("express");
var router = express.Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: All routes concerning users (login, logout, etc.)
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        githubId:
 *          type: integer
 *          format: in64
 */

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *      - User
 *     description: Returns currently logged-in user
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *          $ref: '#/components/schemas/User'
 */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
