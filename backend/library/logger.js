export function log(...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
}

export function error(...args) {
  console.error(...args);
}