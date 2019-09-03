import { MOCK_LOCATIONS } from './../../../mocks/newlocations';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'pvf-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.scss']
})
export class ThresholdComponent implements OnInit {

  public thresholdTemplate = MOCK_THRESHOLD_TEMPLATE;

  constructor() { }

  ngOnInit() {
    this.thresholdTemplate.sensors.forEach(sensor => {
      const coef = 100 / (sensor.sensorType.max - sensor.sensorType.min);
      const indicators = new Map <number, number> ();
      const min = sensor.sensorType.min;
      indicators.set(min, 0);
      indicators.set(sensor.sensorType.max, 100);
      sensor.thresholds.forEach(threshold => {
        const fromPercent = (threshold.range.from - min) * coef;
        const toPercent = (threshold.range.to - min) * coef;
        threshold.range['fromPercent'] = fromPercent;
        threshold.range['toPercent'] = toPercent;
        threshold.range['widthPercent'] = toPercent - fromPercent;
        indicators.set(threshold.range.from, fromPercent);
        indicators.set(threshold.range.to, toPercent);
      });
      sensor['indicators'] = indicators;
    });
  }

}

export const MOCK_THRESHOLD_TEMPLATE = {
  name: 'Threshold mock',
  isCustom: false,
  sensors: [
    {
      sensorType: {
        id: 'id00000',
        name: 'Temperature',
        postfix: 'C',
        min: -20,
        max: 60,
        type: 0
      },
      thresholds: [
        {
          range: {
            from: -5,
            to: 0
          },
          severity: 'LOW',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: -10,
            to: -5
          },
          severity: 'HIGH',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: -20,
            to: -10
          },
          severity: 'CRITICAL',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: 5,
            to: 10
          },
          severity: 'LOW',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: 10,
            to: 15
          },
          severity: 'HIGH',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: 15,
            to: 60
          },
          severity: 'CRITICAL',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        }
      ]
    },
    {
      sensorType: {
        id: 'id00000',
        name: 'Humidity',
        postfix: '%',
        min: 0,
        max: 100,
        type: 0
      },
      thresholds: [
        {
          range: {
            from: 28,
            to: 59
          },
          severity: 'LOW',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: 59,
            to: 80
          },
          severity: 'HIGH',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
        {
          range: {
            from: 80,
            to: 100
          },
          severity: 'CRITICAL',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        },
      ]
    }
  ]
};



