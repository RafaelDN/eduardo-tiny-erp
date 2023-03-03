import { GetDataCorte, log, MapPedido, MapPedidoClient, MapPedidoItems } from "../helper.js";;
import { BulkInsertPedido, BulkInsertPedidoCliente, BulkInsertPedidoItems, SelectPedidos } from "../mysql.js";
import { BuscarPedido, BuscarPedidos } from "../tinyapi.js";

export const ImportarPedidos = async () => {

      const pedidosImportados = [];

      try {
            const DataCorte = GetDataCorte(10).data;
            console.log(`DataCorte ImportarPedidos`, DataCorte)

            let map = new Map()
            map.set("dataInicial", DataCorte);

            const pedidosGravados = await SelectPedidos();

            if(!pedidosGravados || pedidosGravados.length <= 0)
            {
                  log.error("Erro ao buscar pedidos do banco");
                  return;
            }

            const pedidosRetorno = await BuscarPedidosRecursivo(map);

            const pedidos = pedidosRetorno.reduce((prev, curr) => [...prev, ...curr.retorno.pedidos], [])

            for (let index = 0; index < pedidos.length; index++) {
                  const pedido = pedidos[index];

                  try
                  {
                        const existe = pedidosGravados.find(pg => pg.id == +pedido.pedido.id)
                        if(!!existe && existe.id == +pedido.pedido.id)
                        {
                              continue;
                        }

                        console.log('Processando pedido:' + pedido.pedido.id)

                        const PedidoCompleto = await BuscarPedido(pedido.pedido.id);
                        const mapped = MapPedido(PedidoCompleto.retorno.pedido);
                        const mappedClient = MapPedidoClient(PedidoCompleto.retorno.pedido)
                        const items = MapPedidoItems(PedidoCompleto.retorno.pedido);
                        const mappedItems = [];
                        for (let index = 0; index < items.length; index++) {
                              const element = items[index];
                              mappedItems.push(element)
                        }

                        console.log('Inserindo no db')
                        const resultBulk1 = await BulkInsertPedido([mapped])
                        const resultBulk2 = await BulkInsertPedidoCliente([mappedClient])
                        const resultBulk3 = await BulkInsertPedidoItems(mappedItems)
                        // console.table([resultBulk1, resultBulk2, resultBulk3])
                        //console.log({mapped,mappedClient,mappedItems})

                        pedidosImportados.push(pedido.pedido.id)

                  } catch (error) {
                        console.log(error)
                        log.Error('erro for:' + pedido.pedido.id, 'ImportarPedidos', 'ImportarPedidos', error)
                  }
            }

      } catch (error) {
            console.log(error);
            log.Error('erro', 'ImportarPedidos', 'ImportarPedidos', error)
      }

      log.Info(`${pedidosImportados.length} pedidos importados`);
}

const BuscarPedidosRecursivo = async (map, pagina = 1, bag = []) => {
      console.log('Buscando pagina:' + pagina)
      map.set('pagina', pagina)

      let pedidos = await BuscarPedidos(map);

      if(pedidos.retorno.status != 'OK')
            throw 'Erro!';

      bag.push(pedidos);

      if(pedidos.retorno.numero_paginas > pagina) {
            pagina ++;
            await BuscarPedidosRecursivo(map, pagina, bag);
      }

      return bag;
}