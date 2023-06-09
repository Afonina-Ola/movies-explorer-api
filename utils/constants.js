const ERROR_CODES = {
  NOT_FOUND_ERROR: 404,
  ERROR_CODE: 400,
  SERVER_ERROR: 500,
  CONFLICT_CODE: 409,
  UNAUTHORIZED_ERROR: 401,
  FORBIDDEN_ERROR: 403,
};

const options = {
  origin: ['http://localhost:3000', 'https://api.homamovie.nomoredomains.monster',
    'http://api.homamovie.nomoredomains.monster', 'https://github.com/Afonina-Ola/movies-explorer-api'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = { ERROR_CODES, options };
