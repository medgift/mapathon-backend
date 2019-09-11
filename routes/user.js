var express = require("express");
var router = express.Router();

/**
 * @swagger
 *
 components:
   schemas:
     User:
       type: object
       required:
       - username
       - password
       - email
       properties:
       id:
       type: integer
       format: int64
       username:
       type: string
       example: 'jsnow'
       firstName:
       type: string
       example: 'Jon'
       lastName:
       type: string
       example: 'Snow'
       email:
       type: string
       example: 'jsnow@winterfell.org'
       password:
       type: string
       phone:
       type: string
       userStatus:
       type: integer
       format: int32
       description: User Status
 */

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
