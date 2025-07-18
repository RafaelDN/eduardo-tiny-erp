import { GetDataCorte, log, MapPedido, MapPedidoClient, MapPedidoItems, Sleep } from "../helper.js";;
import { BulkInsertPedido, BulkInsertPedidoCliente, BulkInsertPedidoItems, SelectPedidos, UpdateFullPedido } from "../mysql.js";

let config = null;
export const ImportarPedidos = async (_config) => {
      config = _config;
      const pedidosImportados = [];

      try {
            const DataCorte = GetDataCorte(5).data;
            console.log(`DataCorte ImportarPedidos`, DataCorte)

            let map = new Map()
            map.set("dataAtualizacao", DataCorte);

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
                              if(pedido.pedido.situacao != existe.situacao)
                              {
                                    console.log('Atualizando pedido:' + pedido.pedido.id)
                                    const PedidoCompleto = await config.tinyApi.BuscarPedido(pedido.pedido.id);
                                    const mapped = MapPedido(PedidoCompleto.retorno.pedido);
                                    await UpdateFullPedido(mapped);
                              }

                              continue;
                        }

                        console.log('Processando pedido:' + pedido.pedido.id)

                        const PedidoCompleto = await config.tinyApi.BuscarPedido(pedido.pedido.id);
                        const mapped = MapPedido(PedidoCompleto.retorno.pedido);
                        const mappedClient = MapPedidoClient(PedidoCompleto.retorno.pedido)
                        const items = MapPedidoItems(PedidoCompleto.retorno.pedido);
                        const mappedItems = [];
                        for (let index = 0; index < items.length; index++) {
                              const element = items[index];

                              const resultProdutoIndividual = await config.tinyApi.BuscarProduto(element.id_produto);
                              const produtoToMap = resultProdutoIndividual.retorno.produto;
                              element.custo_unitario = produtoToMap.preco_custo;
                              mappedItems.push(element)
                        }

                        console.log('Inserindo no db')
                        const resultBulk1 = await BulkInsertPedido([mapped])
                        const resultBulk2 = await BulkInsertPedidoCliente([mappedClient])
                        const resultBulk3 = await BulkInsertPedidoItems(mappedItems)

                        pedidosImportados.push(pedido.pedido.id)
                        pedidosGravados.push({
                              id: +pedido.pedido.id,
                              situacao: pedido.pedido.situacao
                        })

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
      console.log('sleep:1000')
      await Sleep(1000);
      console.log('Buscando pagina:' + pagina)
      map.set('pagina', pagina)

      let pedidos = await config.tinyApi.BuscarPedidos(map);

      if(pedidos.retorno.status != 'OK')
      {
            console.log("ERRO");
            console.log(pedidos?.retorno);
            console.log('sleep:2000')
            await Sleep(2000);
            await BuscarPedidosRecursivo(map, pagina, bag);
            return bag;
            //throw 'Erro!';
      }

      bag.push(pedidos);

      if(pedidos.retorno.numero_paginas > pagina) {
            pagina ++;
            await BuscarPedidosRecursivo(map, pagina, bag);
      }

      return bag;
}