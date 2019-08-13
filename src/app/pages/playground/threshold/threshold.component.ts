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
      sensor.thresholds.forEach(threshold => {
        threshold.range['fromPercent'] = (threshold.range.from - sensor.sensorType.min) * coef;
        threshold.range['toPercent'] = (threshold.range.to - sensor.sensorType.min) * coef;
        threshold.range['widthPercent'] = threshold.range['toPercent'] - threshold.range['fromPercent'];
      });
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



