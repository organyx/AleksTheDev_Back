export default {
    'port' : 3000,
    'bodyLimit' : '100kb',
    'mongourl' : 'mongodb://localhost:27017/aleksthedev-api',
    'env' : process.env.NODE_ENV || 'dev',
    'secrets' : {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }
}