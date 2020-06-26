import { ClientEnum, FileTypeEnum } from '../enums';

export interface IConfig {
  connection: {
    host?: string;
    user: string;
    password: string;
    port?: number;
    database?: string;
  };
  client: ClientEnum;
  directory: string;
  fileType: FileTypeEnum;
}
