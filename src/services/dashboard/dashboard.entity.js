const Order = require("../order/order.schema");
const { pipelines } = require("./dashboard.function");
const category = {
  week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
}

module.exports.dashboardStats = () => async (req, res) => {
  try {
    const count = await Order.aggregate([
      {
        '$group': {
          '_id': '$status',
          'count': {
            '$sum': 1
          }
        }
      }
    ]);
    let total = 0;
    count.forEach(c => total += c.count);
    const data = { total };
    count.forEach(c => data[c._id] = c.count);
    return res.status(200).send({ message: 'Success', data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
}

module.exports.getOrderGraph = () => async (req, res) => {
  try {
    if (!req.query.filter || !['week', 'month', 'year'].includes(req.query.filter)) {
      return res.status(400).send({ message: 'Bad request' });
    }
    
    const category = {
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      month: Array.from({ length: 30 }, (_, i) => i + 1),
      year: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

    };
    
    const orders = await Order.aggregate(pipelines[req.query.filter]);
    if(req.query.filter==='week'){
      let today = new Date().getDay()+1;
      const cat = [];
      const ord = [];
      for(i=1;i<=7;i++){
        if(today===0) today=7;
        const found= orders.find(o=>o._id===today);
        if(found) {
          cat.push(category.week[found._id-1]);
          ord.push(found.orders);
        }
        else{
          cat.push(category.week[today-1]);
          ord.push(0);

        }
        today--;
      }
      return res.status(200).send({ categories: cat, orders: ord });
    }
    else if(req.query.filter==='month'){
      let today = new Date().getDate();
      const cat = [];
      const ord = [];
     for(i=1;i<=30;i++){
      if(today===0) today=30;
      const found= orders.find(o=>o._id===today);
      if(found) {
        cat.push(category.month[found._id-1]);
        ord.push(found.orders);
      }
      else{
        cat.push(category.month[today-1]);
        ord.push(0);

      }
      today--;

     }
     return res.status(200).send({ categories: cat, orders: ord });

    }
    else if(req.query.filter==='year'){
      let today = new Date().getMonth()+1;
      console.log(orders);
      const cat = [];
      const ord = [];
      for(i=1;i<=12;i++){
        if(today===0) today=12;
        const found= orders.find(o=>o._id===today);
        if(found) {
          cat.push(category.year[found._id-1]);
          ord.push(found.orders);
        }
        else{
          cat.push(category.year[today-1]);
          ord.push(0);
  
        }
        today--;
  
       }
       return res.status(200).send({ categories: cat, orders: ord });

    }
    

  
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Something went wrong' });
  }
};

