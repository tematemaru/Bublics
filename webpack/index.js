if (process.env.APP_ENV === 'production' || process.env.APP_ENV === 'staging') {
  module.exports = require('./production');
} else {
  module.exports = require('./development');
}
