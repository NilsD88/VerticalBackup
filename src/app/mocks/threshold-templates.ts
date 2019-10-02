export let MOCK_THRESHOLD_TEMPLATES_PAGED;
export let MOCK_THRESHOLD_TEMPLATES;

MOCK_THRESHOLD_TEMPLATES = [
  {
    "id":"1",
    "thresholds": [
      {
        "sensorType": {
          "id": 1,
          "name": "temperature",
          "postfix": "°C",
          "min": -20,
          "max": 50,
          "type": "NUMBER"
        },
        "thresholdItems": [
          {
            "id": "1570017564726",
            "range": {
              "from": -3,
              "to": 26
            },
            "severity": "LOW",
            "notification": {
              "web": false,
              "sms": false,
              "mail": false
            }
          }
        ]
      },
      {
        "sensorType": {
          "id": 2,
          "name": "humidity",
          "postfix": "%",
          "min": 0,
          "max": 100,
          "type": "NUMBER"
        },
        "thresholdItems": [
          {
            "id": "1570017666888",
            "range": {
              "from": 39,
              "to": 67
            },
            "severity": "LOW",
            "notification": {
              "web": false,
              "sms": false,
              "mail": false
            }
          }
        ]
      }
    ],
    "name": "azeazeaz"
  }
];


MOCK_THRESHOLD_TEMPLATES_PAGED = {
  data: MOCK_THRESHOLD_TEMPLATES,
  "number":0,
  "size":100,
  "totalElements":2,
  "hasContent":true,
  "last":true,
  "numberOfElements":2,
  "totalPages":1,
  "first":true,
  "sort":null
};

