var Orders = {
  list: (client, filter, callback) => {
    const orderListQuery = `
      SELECT
        customer.gamer_fname AS first_name,
        customer.gamer_minitial As middle_name,
        customer.gamer_lname AS last_name,
        customer.email AS email,
        game_list.game_name AS game_name,
        orders.date_purchase AS date_purchase,
        orders.quantity AS quantity
      FROM orders
      INNER JOIN game_list ON orders.game_id = game_list.game_id
      INNER JOIN customer ON orders.gamer_id = customer.gamer_id
      ORDER BY date_purchase DESC
    `;
    client.query(orderListQuery, (req, res) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Orders;