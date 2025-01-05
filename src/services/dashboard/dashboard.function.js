module.exports.pipelines={
    week: [
      {
        '$match': {
          'status': {
            '$ne': 'cancelled'
          },
          'createdAt': {
            '$gte':new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },

      {
        '$addFields': {
          'day': {
            '$dayOfWeek': '$createdAt'
          }
        }
      },
      {
        '$group': {
          '_id': '$day',
          'orders': {
            '$sum': 1
          }
        }
      }
    ],
    month: [
        {
          '$match': {
            'status': {
              '$ne': 'cancelled'
            },
            'createdAt': {
              '$gte':new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          '$addFields': {
            'day': {
              '$dayOfMonth': '$createdAt'
            }
          }
        },
        {
          '$group': {
            '_id': '$day',
            'orders': {
              '$sum': 1
            }
          }
        }
      ],
      year: [
        {
          '$match': {
            'status': {
              '$ne': 'cancelled'
            },
            'createdAt': {
              '$gte':new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          '$addFields': {
            'day': {
              '$month': '$createdAt'
            }
          }
        },
        {
          '$group': {
            '_id': '$day',
            'orders': {
              '$sum': 1
            }
          }
        }
      ]
    
  }
  