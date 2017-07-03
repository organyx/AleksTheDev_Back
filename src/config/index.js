import bunyan from 'bunyan'

const log = {
    development: () => {
        return bunyan.createLogger({ name: 'AleksTheDev_development', level: 'debug' })
    },
    production: () => {
        return bunyan.createLogger({ name: 'AleksTheDev-production', level: 'info' })
    },
    test: () => {
        return bunyan.createLogger({ name: 'AleksTheDev-test', level: 'fatal' })
    }
}

export default {
    'port' : 3000,
    'bodyLimit' : '100kb',
    'mongourl' : 'mongodb://localhost:27017/aleksthedev-api',
    'env' : process.env.NODE_ENV || 'dev',
    'log': (env) => {
        if(env) return log[env]()
        return log[process.env.NODE_ENV || 'development']()
    },
    'secrets' : {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }
}