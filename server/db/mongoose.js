var mongoose = require('mongoose');
const uriDb = process.env.MONGODB_URI || "mongodb://localhost/blog_app";

mongoose.Promise = global.Promise;
mongoose.connect(uriDb);

module.exports = {mongoose};
