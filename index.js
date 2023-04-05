import { log } from "./helper.js";
import { ImportarPedidos } from "./workers/ImportarPedidos.js";
import { ImportarProdutos } from "./workers/ImportarProdutos.js";
import { ImportarProdutosEstoqueQueue } from "./workers/ImportarProdutosEstoqueQueue.js";
import { ImportarProdutosQueue } from "./workers/ImportarProdutosQueue.js";
import cron from 'node-cron'
import args from 'args'
import { CheckProceduresExists, Ping } from "./mysql.js";

args.option('mode', 'Como o processo será executado. Por padrão vai rodar como um console application', 'default')
const flags = args.parse(process.argv)

if(flags.mode === 'default')
{
      await main();
}

if(flags.mode === 'cron')
{
      await main();
      cron.schedule('*/30 * * * *', async () => {
            await main();
      });
}

async function main() {
      try {

            log.Info("Início do processo. mode: " + flags.mode);

            try {
                  log.Info("Ping it");
                  var p = await Ping();
                  console.log(p)
            } catch (error) {
                  log.Error("Erro processo: Ping", '', '', error);
                  return;
            }

            try {
                  log.Info("Check procedure InsertProdutoEstoque");
                  var result = await CheckProceduresExists('InsertProdutoEstoque');
                  console.log(result[0]["Create Procedure"])
                  if(!result[0]["Create Procedure"])
                        return;
            } catch (error) {
                  log.Error("Erro processo: CheckProceduresExists InsertProdutoEstoque", '', '', error);
                  return;
            }

            try {
                  log.Info("Check procedure updateProduto");
                  var result = await CheckProceduresExists('updateProduto');
                  console.log(result[0]["Create Procedure"])
                  if(!result[0]["Create Procedure"])
                        return;
            } catch (error) {
                  log.Error("Erro processo: CheckProceduresExists updateProduto", '', '', error);
                  return;
            }

            try {
                  log.Info("Exec processo: ImportarPedidos");
                  await ImportarPedidos();
            } catch (error) {
                  log.Error("Erro processo: ImportarPedidos", '', '', error);
            }

            try {
                  log.Info("Exec processo: ImportarProdutosQueue");
                  await ImportarProdutosQueue();
            } catch (error) {
                  log.Error("Erro processo: ImportarProdutosQueue", '', '', error);
            }

            try {
                  log.Info("Exec processo: ImportarProdutosEstoqueQueue");
                  await ImportarProdutosEstoqueQueue();
            } catch (error) {
                  log.Error("Erro processo: ImportarProdutosEstoqueQueue", '', '', error);
            }

            log.Info("Fim do processo");

      } catch (error) {
            log.Fatal('Erro dentro do cron', 'main', 'cron.schedule', error);
      }
}