//异步返回值验证是否存在 并返回有用的部分 为啥叫这个名字 写这个函数的时候在听小说
export const monk = (param: any, key = 'items') => {
  if (param) {
    if (param[key]) {
      return param[key];
    } else {
      return param;
    }
  } else {
    return param;
  }
}
