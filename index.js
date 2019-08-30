const elasticsearchClient = require('elasticsearch').Client;
const mongoClient = require('mongodb').MongoClient;
const debug = require('debug')('mongostic');
const { directRead, changeStreamlisten } = require('./helpers/common');

async function init({
  mongoUrl, mongoOpts, elasticsearchUrl, elasticsearchOpts, config = {},
}) {
  const mongoConnection = await mongoClient.connect(mongoUrl, mongoOpts);
  debug('Mongostic Connected to Mongodb successfully');
  const elasticsearchConnection = await elasticsearchClient(elasticsearchUrl, elasticsearchOpts);
  debug('Mongostic Connected to Elasticsearch client successfully');
  await directRead(mongoConnection, elasticsearchConnection, config);
  debug('Mongostic finished syncing direct reads successfully');
  debug('Mongostic starts listening on mongodb change stream events');
  changeStreamlisten(mongoConnection, elasticsearchConnection, config);
}

module.exports = init;
