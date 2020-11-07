const { port, env } = require('./config/vars')
const { app, mongoose } = require('./app')
mongoose.connect()
app.listen(port, () => console.info(`server started on port ${port} (${env})`))
