import { GetDataCorte, MapearNota, Sleep } from "../helper.js";
import { BulkInsertContasAPagar, SelectContasAPagarID } from "../mysql.js";
import { BuscarContaAPagar, BuscarNotaFiscal } from "../tinyapi.js";

export const ContasAPagar = async () => {

      try {

            const ja_processados = (await SelectContasAPagarID()).map(p => p.id);

            const filtros = new Map();
            filtros.set("data_ini_vencimento", GetDataCorte(2).data);
            filtros.set("data_fim_vencimento ", GetDataCorte(0).data);

            const response = await BuscarContasAPagarRecursivo(filtros);

            const nfs = response.reduce((prev, curr) => [...prev, ...curr.retorno.contas], [])

            await ExecutarNfs(nfs, ja_processados);

      } catch (error) {
            console.log(error)

      }
}

const BuscarContasAPagarRecursivo = async (map, pagina = 1, bag = []) => {
    console.log('Buscando pagina:' + pagina)
    map.set('pagina', pagina)

    let contas = await BuscarContaAPagar(map);

    if(contas.retorno.status != 'OK')
          throw 'Erro!';

    bag.push(contas);

    if(contas.retorno.numero_paginas > pagina) {
          pagina ++;
          await BuscarContasAPagarRecursivo(map, pagina, bag);
    }

    return bag;
}

async function ExecutarNfs(nfs, ja_processados) {
    /*
        Com a lista de NFs faz a consulta individual
        */
    for (let index = 0; index < nfs.length; index++) {
      try {
        const element = nfs[index];

        if (ja_processados.includes(+element.conta.id)) {
          console.log(element.conta.id + " ja foi processado");
          continue;
        }
        console.log("Processando Conta ID " + element.conta.id);
        const data = await BuscarNotaFiscal(element.conta.id);
        const nf_completa = data.retorno.conta;

        // faço o map com os campos que preciso
        const mapped = MapearNota(nf_completa, element.conta);

        await BulkInsertContasAPagar([mapped]);

        await Sleep(2000);
      } catch (error) {
        console.log("Caiu no catch 02", error);
        await Sleep(2000);
      }
    }
  }