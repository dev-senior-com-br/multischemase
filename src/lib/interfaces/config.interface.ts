import { ClientEnum, FileTypeEnum } from '../enums';

export interface IConfig {
  connection: {
    url?: string;
    host?: string;
    user: string;
    pass: string;
    port?: string;
    database?: string;
  };
  client: ClientEnum;
  directory: string;
  fileType: FileTypeEnum;
}
