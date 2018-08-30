var Brand = {
  list: (client, filter, callback) => {
    const brandListQuery = `
      SELECT * FROM game_pub
      `;
    client.query(brandListQuery, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    })
  }
};
module.exports = Brand;