import { Base } from './base.js';
import { Posts } from './posts/index.js';
import { applyMixins } from './utils.js';

class Typicode extends Base {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Typicode extends Posts {}
applyMixins(Typicode, [Posts]);
export default Typicode;
