module.exports = function formatUser(user) {
  if (user) {
    return {
      id: user.user_id,
      name: user.name,
      picture: user.picture,
      email: user.email
    };
  } else {
    return null;
  }
};
