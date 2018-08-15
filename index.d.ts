import {SequelizeStatic, Sequelize, Model, DefineAttributes, DefineOptions} from 'sequelize';
import Promise = require("bluebird");

declare namespace ThinkSequelize {
  interface InjectModel extends Model<any, any> {
    define: {
      attributes: DefineAttributes;
      options?: DefineOptions<any>;
    };
    getConnection(modelName?: string): Sequelize;
  }

  interface SequelizeModel extends Sequelize {
    new(modelName?: string, config?: object): InjectModel;
    Sequel: SequelizeStatic;
    Relation: {
      HAS_ONE: 'hasOne',
      BELONG_TO: 'belongsTo',
      HAS_MANY: 'hasMany',
      MANY_TO_MANY: 'belongsToMany'
    };
  }
  interface ModelThinkExtend {
    Sequel: SequelizeModel;
  }
  interface ModelExtend {
    sequel(name: string, config?: any, module?: string): InjectModel;
  }
}

declare module 'thinkjs' {
  interface Think extends ThinkSequelize.ModelExtend, ThinkSequelize.ModelThinkExtend {
  }
  interface Controller extends ThinkSequelize.ModelExtend {
  }
  interface Context extends ThinkSequelize.ModelExtend {
  }
  interface Service extends ThinkSequelize.ModelExtend {
  }
}

export = ThinkSequelize;
