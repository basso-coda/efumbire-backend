const Stock = require("../db/models/gestion_stocks/Stock");
const StockMouvement = require("../db/models/gestion_stocks/StockMouvement");

class StockService {

   static async addStock({
      type_engrais_id,
      colline_id,
      quantite,
      reference_type,
      reference_id
   }, transaction) {

      let stock = await Stock.findOne({
         where: { type_engrais_id, colline_id },
         transaction
      });

      if (!stock) {
         stock = await Stock.create({
            type_engrais_id,
            colline_id,
            quantite_disponible: 0
         }, { transaction });
      }

      const newQuantity =
         Number(stock.quantite_disponible) + Number(quantite);

      await stock.update({
         quantite_disponible: newQuantity
      }, { transaction });

      await StockMouvement.create({
         stock_id: stock.id_stock,
         type_mouvement: "ENTREE",
         quantite,
         reference_type,
         reference_id
      }, { transaction });

      return stock;
   }

   static async removeStock({
      type_engrais_id,
      colline_id,
      quantite,
      reference_type,
      reference_id
   }, transaction) {

      const stock = await Stock.findOne({
         where: { type_engrais_id, colline_id },
         transaction
      });

      if (!stock) {
         throw new Error("Stock introuvable");
      }

      if (Number(stock.quantite_disponible) < Number(quantite)) {
         throw new Error("Stock insuffisant");
      }

      const newQuantity =
         Number(stock.quantite_disponible) - Number(quantite);

      await stock.update({
         quantite_disponible: newQuantity
      }, { transaction });

      await StockMouvement.create({
         stock_id: stock.id_stock,
         type_mouvement: "SORTIE",
         quantite,
         reference_type,
         reference_id
      }, { transaction });

      return stock;
   }
}

module.exports = StockService;