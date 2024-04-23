import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from '../users/entities/user.entity';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  synchronize: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrationsRun: false,
  migrationsTableName: 'bf_migrations',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
};

const dataSource = new DataSource({
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number(`${process.env.DB_PORT}`),
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [Users],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'xbill_migrations',
  synchronize: false,
  logging: ['error'],
});

export default dataSource;
