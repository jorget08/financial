export type EnvName =
  | 'port'
  | 'jwtKey'
  | 'replica'
  | 'dbInstance'
  | 'dbPort'
  | 'dbHost'
  | 'dbPass'
  | 'dbUser'
  | 'db'
  | 'dbrInstance'
  | 'dbrPort'
  | 'dbrHost'
  | 'dbrPass'
  | 'dbrUser'
  | 'dbr'
  | 'awsAccessKeyId'
  | 'awsSecretAccessKey'
  | 'awsRegion'
  | 'bucketName'
  | 'FRONTEND_URL';

export const envConfig = () => ({
  // Envs
  port: +process.env.PORT,
  jwtKey: process.env.JWT_KEY,
  replica: Boolean(+process.env.REPLICA),

  // Database
  dbInstance: process.env.DB_INSTANCE,
  dbPort: +process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbPass: process.env.DB_PASS,
  dbUser: process.env.DB_USER,
  db: process.env.DB,
});

export default envConfig;
