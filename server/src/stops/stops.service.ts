import { Injectable } from '@nestjs/common';

@Injectable()
export class StopsService {
  getStops(): any {
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
