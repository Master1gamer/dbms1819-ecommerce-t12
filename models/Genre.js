var Genre = {
  list: (client, filter, callback) => {
    const game_gen = `
      SELECT * FROM game_gen
      `;
    client.query(game_gen, (req, data) => {
      console.log(data.rows);
      callback(data.rows);
    })
  }
};
module.exports = Genre;