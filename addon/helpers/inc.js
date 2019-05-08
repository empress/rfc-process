import { helper } from '@ember/component/helper';

export function inc(params) {
  let num = parseInt(params[0]);

  return num + 1;
}

export default helper(inc);
