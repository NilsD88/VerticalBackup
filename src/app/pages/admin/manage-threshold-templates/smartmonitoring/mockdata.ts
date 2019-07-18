export const MOCKDATA = {
  name: 'Threshold mock',
  isCustom: false,
  sensors: [
    {
      sensorType: {
        id: 'id00000',
        name: 'Temperature',
        postfix: 'C',
        min: -10,
        max: 60,
        type: 0
      },
      thresholds: [
        {
          range: {
            from: 0,
            to: 5
          },
          severity: 'LOW',
          alert: {
            notification: true,
            sms: false,
            mail: false
          }
        }
      ]
    }
  ]
};


