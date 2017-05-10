import mongoose from 'mongoose'

import config from './config'

export default callback => {
    mongoose.Promise = global.Promise
    let db = mongoose.connect(config.mongourl)
    callback(db)
}