const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 });

// route middleware to cache calls to the Auth0 management API (for user info, which doesn't change frequently)
module.exports = cache;
