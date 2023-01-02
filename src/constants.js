export const NODE_ENV = 'production'

console.log(`we are in ${NODE_ENV} mode!`);
export const API = (NODE_ENV === 'production') ? 'https://dawn-forest-9292.fly.dev/api/' : 'http://localhost:3005/api/';
export const API_WS_ROOT = (NODE_ENV === 'production') ? 'https://dawn-forest-9292.fly.dev/api/cable' : 'ws://localhost:3005/api/cable';
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
