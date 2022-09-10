var Schema, User;

module.exports = function (mongoose) {
  // Based on the dailyjs.com tutorial: Nodepad
  // Source: https://github.com/alexyoung/nodepad/blob/master/models.js
  // Virtual attributes are getters and setters
  // Middleware is a convenient way of injecting functions into key lifecycle events.
  (Schema = mongoose.Schema),
    (User = new Schema({
      id: {
        type: String,
        required: true,
        unique: true,
      },
      username: { type: String },
    }));

  // User.virtual('id').get(function() {
  //     return this._id.toHexString();
  // });

  return mongoose.model("User", User);
};
