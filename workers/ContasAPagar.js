import { GetDataCorte, MapearNota, Sleep, log } from "../helper.js";
import { BulkInsert, Select } from "../mysql.js";

let config = null;
export const ContasAPagar = async (_config) => {
  config = _config;
  try {
    const ja_processados = (await Select(config.tabelas.contasAPagar, ['id'])).map((p) => p.id);

    const filtros = new Map();
    filtros.set("data_ini_emissao", GetDataCorte(15).data);
    filtros.set("data_fim_emissao", GetDataCorte(0).data);

    log.Info("ContasAPagar filtros: " + JSON.stringify(Object.fromEntries(filtros), null, 2));

    const response = await BuscarContasAPagarRecursivo(filtros);

    const nfs = response.reduce(
      (prev, curr) => [...prev, ...curr.retorno.contas],
      []
    );

    const faltantes = nfs.filter(element => !ja_processados.includes(+element.conta.id));

    log.Info(`Foram encontradas ${faltantes.length} nfs a serem importadas`);

    if(faltantes.length > 0)
    {
      const nf_errors = await ExecutarNfs(faltantes, ja_processados);
      if(nf_errors.length > 0)
        await ExecutarNfs(nf_errors, ja_processados);
    }
  } catch (error) {
    console.log(error);
  }
};

const BuscarContasAPagarRecursivo = async (map, pagina = 1, bag = []) => {
  console.log("Buscando pagina:" + pagina);
  map.set("pagina", pagina);

  let contas = await config.tinyApi.BuscarContaAPagar(map);

  if (contas.retorno.status != "OK") throw "Erro!";

  bag.push(contas);

  if (contas.retorno.numero_paginas > pagina) {
    pagina++;
    await BuscarContasAPagarRecursivo(map, pagina, bag);
  }

  return bag;
};

async function ExecutarNfs(nfs, ja_processados) {
  let nfsError = [];
  /*
    Com a lista de NFs faz a consulta individual
    */
  for (let index = 0; index < nfs.length; index++) {
    const element = nfs[index];

    try {
      if (ja_processados.includes(+element.conta.id)) {
        console.log(element.conta.id + " ja foi processado");
        continue;
      }
      console.log("Processando Conta ID " + element.conta.id);
      const data = await config.tinyApi.BuscarNotaFiscal(element.conta.id);
      const nf_completa = data.retorno.conta;

      // faço o map com os campos que preciso
      const mapped = MapearNota(nf_completa, element.conta);

      await BulkInsert(config.tabelas.contasAPagar, [mapped]);

      await Sleep(2000);
    } catch (error) {
      nfsError.push(element);
      console.error("Caiu no catch 02", error);
      await Sleep(2000);
    }
  }

  return nfsError;
}
