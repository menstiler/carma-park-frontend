const NODE_ENV = 'production'

console.log(`we are in ${NODE_ENV} mode!`);
export const API = (NODE_ENV === 'production') ? 'https://guarded-fjord-26437.herokuapp.com/' : 'http://localhost:3005/';
export const API_WS_ROOT = (NODE_ENV === 'production') ? 'wss://guarded-fjord-26437.herokuapp.com/cable' : 'ws://localhost:3005/cable';
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
