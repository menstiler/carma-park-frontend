export const NODE_ENV = 'production'

console.log(`we are in ${NODE_ENV} mode!`);
export const API = (NODE_ENV === 'production') ? 'https://carmapark.herokuapp.com/' : 'http://localhost:3005/';
export const API_WS_ROOT = (NODE_ENV === 'production') ? 'wss://carmapark.herokuapp.com/cable' : 'ws://localhost:3005/cable';
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
