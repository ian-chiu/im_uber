import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stop } from './stops.model';

@Injectable()
export class StopsService {
  constructor(@InjectModel('stop') private readonly stopModel: Model<Stop>) {}

  async insertStop(name: string, latitude: number, longitude: number) {
    const newStop = new this.stopModel({
      name,
      location: {
        type: 'Point',
        // longitude comes first in GeoJSON
        coordinates: [longitude, latitude],
      },
    });
    try {
      await newStop.save();
      return newStop;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Stop already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async getStops() {
    const stops = await this.stopModel.find();
    return stops;
  }

  async getStopByName(stopName: string) {
    const stop = await this.stopModel.findOne({ name: stopName });
    return stop;
  }

  getStops_dev(): any {
    return [
      {
        id: 0,
        name: '新竹高鐵站',
        latitude: 24.807282359338483,
        longitude: 121.04050172232557,
      },
      {
        id: 1,
        name: '臺積電五廠',
        latitude: 24.774451062456148,
        longitude: 120.99816376901293,
      },
      {
        id: 2,
        name: '金山街塔',
        latitude: 24.777044600209447,
        longitude: 121.02514493860002,
      },
      {
        id: 3,
        name: '新竹市立動物園',
        latitude: 24.80044826523704,
        longitude: 120.97987888212046,
      },
      {
        id: 4,
        name: '交大門口土地公廟',
        latitude: 24.78709056239894,
        longitude: 120.99749874432568,
      },
      {
        id: 5,
        name: '新竹轉運站',
        latitude: 24.801285760203864,
        longitude: 120.97241441651721,
      },
    ];
  }
}
