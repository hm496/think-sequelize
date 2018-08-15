const path = require('path');
const sequelize = require('sequelize');
const Socket = require('./socket.js');
const debug = require('debug')('think-sequelize');
const { extendClassMethods } = require('./util.js');
const MODELS = Symbol('think-sequelize-models');
const models = {};
const conns = {};

class Model {
  constructor(modelName, config, name) {
    this.modelName = modelName;
    this.config = config;
    if (models[name]) return models[name];

    // connect
    const socket = Socket.getInstance(this.config);
    const sequelizeConn = socket.createConnection();
    conns[modelName] = sequelizeConn;

    // define
    let define = this.define || {};
    if (!define.attributes) {
      define = {
        attributes: define,
        options: {},
        relations: []
      };
    }
    define.options = Object.assign({}, define.options);
    this.defineOptions = define;
    debug(`ModelName: ${modelName}, Schema: ${JSON.stringify(this.defineOptions)}`);

    const model = sequelizeConn.define(this.modelName, define.attributes, define.options);

    this.modelClass = class extends model {
    };
    extendClassMethods(this.modelClass, this);
    models[name] = this.modelClass;

    return this.modelClass;
  }

  /**
   * get table prefix
   */
  get tablePrefix() {
    return this.config.prefix || '';
  }

  /**
   * get table name, with table prefix
   */
  get tableName() {
    const defineOptions = this.defineOptions;
    if (defineOptions.options.freezeTableName && defineOptions.options.tableName) return defineOptions.options.tableName;
    return this.tablePrefix + this.modelName;
  }

  /**
   * get model conntection
   */
  getConnection(modelName = this.modelName) {
    return conns[modelName] || {};
  }

  /**
   * get all store models
   */
  get models() {
    return this[MODELS] || {};
  }

  /**
   * set models
   */
  set models(value) {
    this[MODELS] = value;
  }

  /**
   * get model instance
   * @param {String} name
   */
  sequel(name) {
    const ModelClass = this.models[name] || Model;
    const modelName = path.basename(name);
    const instance = new ModelClass(modelName, this.config, name);
    instance.models = this.models;
    return instance;
  }
}

Model.Sequel = sequelize;
Model.Relation = {
  HAS_ONE: 'hasOne',
  BELONG_TO: 'belongsTo',
  HAS_MANY: 'hasMany',
  MANY_TO_MANY: 'belongsToMany'
};
module.exports = Model;
