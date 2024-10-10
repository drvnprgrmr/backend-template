import {
  GetPlaceCommand,
  GetPlaceCommandInput,
  LocationClient,
  SearchPlaceIndexForSuggestionsCommand,
  SearchPlaceIndexForSuggestionsRequest,
} from '@aws-sdk/client-location';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsConfig, Config } from 'src/config';

@Injectable()
export class AwsLocationService {
  private readonly logger = new Logger(AwsLocationService.name);
  private readonly awsConfig: AwsConfig;
  private readonly client: LocationClient;

  constructor(private readonly configService: ConfigService<Config, true>) {
    this.awsConfig = this.configService.get('aws', { infer: true });
    this.client = new LocationClient({ region: this.awsConfig.region });
  }

  async getPlace(placeId: string) {
    const input: GetPlaceCommandInput = {
      IndexName: this.awsConfig.location.indexName,
      PlaceId: placeId,
    };

    const command = new GetPlaceCommand(input);

    const response = await this.client.send(command);

    return response.Place;
  }

  async getSuggestions(data: {
    text: string;
    filterCountries?: string[];
    maxResults?: number;
  }) {
    const input: SearchPlaceIndexForSuggestionsRequest = {
      IndexName: this.awsConfig.location.indexName,
      Text: data.text,
      FilterCountries: data.filterCountries,
      MaxResults: data.maxResults,
    };

    const command = new SearchPlaceIndexForSuggestionsCommand(input);

    const response = await this.client.send(command);

    return response.Results;
  }
}
