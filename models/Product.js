var Product = {
  getById: (client, productId, callback) => {
    const productQuery = `SELECT game_list.game_id AS game_id,
        game_list.game_name AS game_name,
        game_list.imgurl AS imgurl,
        game_list.description AS products_description,
        game_list.price AS products_price,
        game_pub.pub_name AS pub_name,
        game_gen.gen_name AS gen_name
      FROM game_list
      INNER JOIN game_pub ON game_list.game_pub = game_pub.pub_name
      INNER JOIN game_gen ON game_list.game_gen = game_gen.gen_name
      WHERE game_id = ${productId}
      ORDER BY game_id ASC
    `;
    client.query(productQuery, (req, data) => {
      console.log(req);
      console.log(data.rows[0]);
      var productData = {
        id: data.rows[0].game_id,
        name: data.rows[0].game_name,
        description: data.rows[0].products_description,
        image: data.rows[0].imgurl,
        price: data.rows[0].products_price,
        pubname: data.rows[0].pub_name,
        gen: data.rows[0].gen_name
      };
      callback(productData);
    });
  },

  list: (client, filter, callback) => {
    const productListQuery = `
      SELECT
        game_list.game_id AS game_id,
        game_list.game_name AS game_name,
        game_list.imgurl AS imgurl,
        game_list.description AS description,
        game_list.price AS _price,
        game_pub.pub_name AS pub_name,
        game_gen.gen_name AS gen_name
      FROM game_list
      INNER JOIN game_pub ON game_list.game_pub = game_pub.pub_name
      INNER JOIN game_gen ON game_list.game_ge = game_gen.gen_name
    `;
    client.query(productListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    });
  }
};
module.exports = Product;