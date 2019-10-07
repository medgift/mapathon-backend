const NodeCache = require("node-cache");
const cache = new NodeCache();

// route middleware to cache calls to the Auth0 management API (for user info, which doesn't change frequently)
module.exports = cache;
