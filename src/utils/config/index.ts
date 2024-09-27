import { plainToInstance, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export class ConfigEnvClass {
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  BASE_URL: string;

  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  PORT = 3000;
}

export let configEnv: ConfigEnvClass;
export function validateEnv(config: Record<string, unknown>) {
  configEnv = plainToInstance(ConfigEnvClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(configEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return configEnv;
}
