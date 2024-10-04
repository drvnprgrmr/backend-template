import { IsAscii, IsEnum, IsOptional } from 'class-validator';

export enum QrcodeFileType {
  PNG = 'png',
  SVG = 'svg',
}

export class GetQrcodeDto {
  @IsAscii()
  data: string;

  @IsEnum(QrcodeFileType)
  @IsOptional()
  fileType?: QrcodeFileType = QrcodeFileType.PNG;
}
