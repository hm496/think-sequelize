# Sequelize for ThinkJS
forked from `https://github.com/thinkjs/think-sequelize`

Differences:    
Fix TypeScript types;

Rename property `schema` to `define`;
```typescript
// src/model/user.ts
import {think} from 'thinkjs';
import {Define} from 'think-sequelize2';

module.exports = class extends think.Sequel {
  get define():Define {
    return {
      attributes: {},
      options: {},
      relations: []
    }
  }
}
```
