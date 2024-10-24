import { IsEnum, IsNumberString, IsString, Matches } from 'class-validator';

enum AccountType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
}

enum DocumentType {
  IDENTITY_NUMBER = 'identityNumber',
  PASSPORT_NUMBER = 'passportNumber',
  BUSINESS_REGISTRATION_NUMBER = 'businessRegistrationNumber',
}

export class ValidateAccountDto {
  @IsString()
  account_name: string;

  @IsNumberString()
  account_number: string;

  @IsEnum(AccountType)
  account_type: AccountType;

  @IsNumberString()
  bank_code: string;

  @Matches(/^[A-Z]{2}$/)
  country_code: string;

  @IsEnum(DocumentType)
  document_type: DocumentType;

  @IsNumberString()
  document_number?: string;
}
