const { mongoose } = require('../app')
const {dropDb} = require('./db')
mongoose
  .connect()
  .then(dropDb)
  .finally(mongoose.disconnect)
