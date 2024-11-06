import { Sleep, execFunc, log } from "./helper.js";
import { ImportarPedidos } from "./workers/ImportarPedidos.js";
import { ImportarProdutos } from "./workers/ImportarProdutos.js";
import { ImportarProdutosEstoqueQueue } from "./workers/ImportarProdutosEstoqueQueue.js";
import { ImportarProdutosQueue } from "./workers/ImportarProdutosQueue.js";
import cron from 'node-cron'
import args from 'args'
import { CheckProceduresExists, Ping, SPTeste, SelectPedidos, UpdateFullPedido, UpdateProcedures } from "./mysql.js";
import { BuscarPedido } from "./tinyapi.js";
import { ContasAPagar } from "./workers/ContasAPagar.js";
import { ContasAReceber } from "./workers/ContasAReceber.js";

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

if(flags.mode === 'cron-1-am')
{
      await main();
      cron.schedule('0 1 * * *', async () => {
            await main();
      });
}

async function main() {
      try {

            log.Info("Início do processo. mode: " + flags.mode);

            await execFunc(Ping);
            await execFunc(ContasAPagar);
            await execFunc(ContasAReceber);



            //await ContasAPagar();
            //await ContasAReceber();

            // try {
            //       log.Info("Exec processo: ImportarPedidos");
            //       await ImportarPedidos();
            // } catch (error) {
            //       log.Error("Erro processo: ImportarPedidos", '', '', error);
            // }

            // try {
            //       log.Info("Exec processo: ImportarProdutosQueue");
            //       await ImportarProdutosQueue();
            // } catch (error) {
            //       log.Error("Erro processo: ImportarProdutosQueue", '', '', error);
            // }

            // try {
            //       log.Info("Exec processo: ImportarProdutosEstoqueQueue");
            //       await ImportarProdutosEstoqueQueue();
            // } catch (error) {
            //       log.Error("Erro processo: ImportarProdutosEstoqueQueue", '', '', error);
            // }

            log.Info("Fim do processo");

      } catch (error) {
            log.Fatal('Erro dentro do cron', 'main', 'cron.schedule', error);
      }
}