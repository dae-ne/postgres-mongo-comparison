interface AppConfig {
  port: number;
}

export const appConfig: AppConfig = {
  port: +(process.env.APP_PORT ?? 3000)
};
