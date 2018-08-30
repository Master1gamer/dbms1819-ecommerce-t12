var Customer = {
  getById: (client, customerId, callback) => {
    const customerQuery = `SELECT
        customer.gamer_fname AS first_name,
        customer.gamer_minitial AS middle_name,
        customer.gamer_lname AS last_name,
        customer.email AS email,
        customer.state AS state,
        customer.city AS city,
        customer.phone AS phone,
        customer.gamer_id AS gamer_id,
        gamer_list.game_name AS game_name,
        orders.quantity AS quantity,
        orders.date_purchase AS date_purchase
      FROM orders
      INNER JOIN customer ON orders.gamer_id = customer.gamer_id
      INNER JOIN game_list ON orders.game_id = game_list.game_id
      WHERE customers.id = ${customerId}
      ORDER BY date_purchase DESC
    `;
    client.query(customerQuery, (req,data) => {
      console.log(data.rows);
      var customerData = {
        id: data.rows[0].gamer_id,
        first_name: data.rows[0].first_name,
        middle_name: data.rows[0].middle_name,
        last_name: data.rows[0].last_name,
        email: data.rows[0].email,
        state: data.rows[0].state,
        city: data.rows[0].city,
        phone: data.rows[0].phone,
        game_name: data.rows[0].game_name,
        quantity: data.rows[0].quantity,
        date_purchase: data.rows[0].date_purchase
      };
      callback(customerData);
    });
  },

  list: (client, filter, callback) => {
    const customerListQuery = `
      SELECT * FROM customer
      ORDER BY gamer_id DESC
    `;
    client.query(customerListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Customer;