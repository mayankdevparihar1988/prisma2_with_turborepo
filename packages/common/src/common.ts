import pkg from 'lodash';
// eslint-disable-next-line import/extensions
import HELLO from './helper.cjs';

const { toUpper } = pkg;

export const sayHello = (name: string) => {
  console.log(`Say Hello to ${name}`);
  return `${HELLO} ${toUpper(name)}`;
};
