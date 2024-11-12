import { execFunc, log, env } from "./helper.js";
// import { ImportarPedidos } from "./workers/ImportarPedidos.js";
// import { ImportarProdutos } from "./workers/ImportarProdutos.js";
// import { ImportarProdutosEstoqueQueue } from "./workers/ImportarProdutosEstoqueQueue.js";
// import { ImportarProdutosQueue } from "./workers/ImportarProdutosQueue.js";
import cron from "node-cron";
import args from "args";
import { Ping } from "./mysql.js";
import { createTinyApi } from "./tinyapi.js";
import { ContasAPagar } from "./workers/ContasAPagar.js";
import { ContasAReceber } from "./workers/ContasAReceber.js";

args.option(
  "mode",
  "Como o processo será executado. Por padrão vai rodar como um console application"
);
args.option(
  "profile",
  "Como o processo será executado. Por padrão vai rodar como um console application"
);
const flags = args.parse(process.argv);

if (flags.profile === "default") {
  const config = {
    services: [ContasAPagar, ContasAReceber],
    tinyApi: createTinyApi(env.API_TINY_TOKEN),
    profile: flags.profile,
    tabelas: {
      contasAPagar: "contas_a_pagar",
      contasAReceber: "contas_a_receber",
    },
  };
  await runMode(config);
}

if (flags.profile === "dc") {
  const config = {
    services: [ContasAPagar, ContasAReceber],
    tinyApi: createTinyApi(env.API_TINY_TOKEN_DC),
    profile: flags.profile,
    tabelas: {
      contasAPagar: "contas_a_pagar_dc",
      contasAReceber: "contas_a_receber_dc",
    },
  };
  await runMode(config);
}

async function runMode(config) {
  if (flags.mode === "default") {
    await main(config);
  }

  if (flags.mode === "cron") {
    await main();
    cron.schedule("*/30 * * * *", async () => {
      await main();
    });
  }

  if (flags.mode === "cron-1-am") {
    cron.schedule("0 1 * * *", async () => {
      await main(config);
    });
  }
}

async function main(config) {
  try {
    log.Info("Início do processo.");
    log.Info("  mode: " + flags.mode);
    log.Info("  profile: " + flags.profile);

    await execFunc(Ping, config);

    for (let index = 0; index < config.services.length; index++) {
      const service = config.services[index];
      await execFunc(service, config);
    }

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
    log.Fatal("Erro dentro do cron", "main", "cron.schedule", error);
  }
}
