export type AppConfig = {
  port: number;
};

export const appConfig: AppConfig = {
  port: +(process.env.PORT ?? 8000)
};
