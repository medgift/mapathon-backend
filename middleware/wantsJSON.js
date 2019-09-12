function wantsJson() {
  return this.accepts("html", "json") === "json";
}
module.exports = wantsJson;
