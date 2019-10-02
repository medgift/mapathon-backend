module.exports.sendForbidden = res => {
  return errorHandler(
    res,
    403,
    "You are not allowed to access/modify this resource"
  );
};

module.exports.sendNotFound = res => {
  return errorHandler(res, 404, "The desired resource was not found");
};

function errorHandler(res, status, error) {
  res.status(status).send({
    error: {
      status: status,
      title: error
    }
  });
}
