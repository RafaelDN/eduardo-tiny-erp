import { log } from "./helper.js";
import { ImportarPedidos } from "./workers/ImportarPedidos.js";
import { ImportarProdutos } from "./workers/ImportarProdutos.js";
import { ImportarProdutosEstoqueQueue } from "./workers/ImportarProdutosEstoqueQueue.js";
import { ImportarProdutosQueue } from "./workers/ImportarProdutosQueue.js";
import cron from 'node-cron'

async function main() {
      try {
            log.Info("Início do processo");

            try {
                  log.Info("Exec processo: ImportarPedidos");
                  await ImportarPedidos();
            } catch (error) {
                  log.Error("Erro processo: ImportarPedidos", '', '', error);
            }

            try {
                  log.Info("Exec processo: ImportarProdutos");
                  await ImportarProdutos();
            } catch (error) {
                  log.Error("Erro processo: ImportarProdutos", '', '', error);
            }

            try {
                  log.Info("Exec processo: ImportarProdutosEstoqueQueue");
                  await ImportarProdutosEstoqueQueue();
            } catch (error) {
                  log.Error("Erro processo: ImportarProdutosEstoqueQueue", '', '', error);
            }

            try {
                  log.Info("Exec processo: ImportarProdutosQueue");
                  await ImportarProdutosQueue();
            } catch (error) {
                  log.Error("Erro processo: ImportarProdutosQueue", '', '', error);
            }

            log.Info("Fim do processo");

      } catch (error) {
            log.Fatal('Erro dentro do cron', 'main', 'cron.schedule', error);
      }
}

cron.schedule('*/30 * * * *', async () => {
      await main();
});