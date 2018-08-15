const helper = require('think-helper');
const path = require('path');
const Model = require('./lib/model.js');
const Relations = {};

module.exports = app => {
  function model(name, config, m = 'common') {
    const models = app.modules.length ? (app.models[m] || {}) : app.models;
    const Cls = models[name] || Model;
    const modelName = path.basename(name);
    const instance = new Cls(modelName, config, name);
    instance.models = models;

    // set relation
    let relations = instance.defineOptions.relations;
    if (relations) {
      if (helper.isObject(relations)) {
        relations = [relations];
      }
      relations.forEach((ele, index) => {
        const relationModelName = Object.keys(ele).filter(e => {
          return e !== 'options';
        })[0];

        const relationName = ele[relationModelName];
        const relationInstance = model(relationModelName, config, m);
        const relationOptions = Object.assign({}, ele.options);

        const relationUnique = `${name}${relationName}${relationModelName}${relationOptions.as}`;
        if (relationOptions.as) {
          if (Relations[relationUnique]) {
            return;
          } else {
            Relations[relationUnique] = true;
          }
        }

        instance[relationName](relationInstance, relationOptions);
      });
    }

    return instance;
  };

  function injectModel(name, config, m) {
    const modelConfig = app.think.config('model', undefined, m);
    config = helper.parseAdapterConfig(modelConfig, config);
    return model(name, config, m);
  }

  return {
    think: {
      Sequel: Model,
      sequel: injectModel
    },
    service: {
      sequel: injectModel
    },
    controller: {
      sequel(name, config, m) {
        return this.ctx.sequel(name, config, m);
      }
    },
    context: {
      sequel(name, config, m = this.module) {
        config = helper.parseAdapterConfig(this.config('model'), config);
        return model(name, config, m);
      }
    }
  };
};
