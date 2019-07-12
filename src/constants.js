const DEV_API_BASE_URL = 'http://localhost:5000';
const PROD_API_BASE_URL = 'https://api.myfoodplan.app';

export const API_BASE_URL =
  process.env.NODE_ENV === 'development' ? DEV_API_BASE_URL : PROD_API_BASE_URL;
