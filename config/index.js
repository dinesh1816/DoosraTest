const fs = require('fs');
const path = require('path');

const config = () => {
  process.env.NODE_ENV = 'production';
  switch (process.env.NODE_ENV) {
    case 'default':
      return JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'default.json')),
      );
    case 'dev':
      return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'dev.json')));
    case 'production':
      return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'prod.json')));
    default:
      throw new Error('Config variables not set');
  }
};
export default config();
