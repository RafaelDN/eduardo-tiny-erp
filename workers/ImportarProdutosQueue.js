import { GetDataCorte, log, MapProduto, MapProdutoPreco } from "../helper.js";
import {  BulkInsertProduto, BulkInsertProdutoPreco, SelectProduto, UpdateFullProduto, UpdateProduto } from "../mysql.js";
import { BuscarProduto, BuscarProdutoAtualizacaoQueue } from "../tinyapi.js";

export const ImportarProdutosQueue = async () => {

      try {
            const DataCorte = GetDataCorte(5).data;
            console.log(`DataCorte ImportarProdutosQueue`, DataCorte)

            let map = new Map()
            map.set("dataAlteracao", DataCorte);

            while (true) {

                  const data = await BuscarProdutoAtualizacaoQueue(map);
                  const produtos = data.retorno.produtos;

                  if(!produtos || produtos.length <= 0) {
                        log.Info(`Não há produtos para atualizar info`);
                        break;
                  }

                  for (let index = 0; index < produtos.length; index++) {
                        const produto = produtos[index].produto;

                        try {
                              const { id, unidade, preco, preco_promocional,  preco_custo, situacao} = produto;
                              console.log(`Processando precos ${id}`)
                              await UpdateProduto(id, unidade, preco, preco_promocional, preco_custo, situacao);

                              console.log(`Processando info ${id}`)
                              const resultProdutoIndividual = await BuscarProduto(id);
                              const produtoToMap = resultProdutoIndividual.retorno.produto;
                              const mapped = MapProduto(produtoToMap);
                              const items = MapProdutoPreco(produtoToMap);

                              let produtoCadastro = await SelectProduto(id)
                              console.log(`produtoCadastro`, produtoCadastro)

                              if(produtoCadastro.length <= 0)
                              {
                                    console.log('inserting..')
                                    await BulkInsertProduto([mapped])
                                    await BulkInsertProdutoPreco([items])
                              }
                              else
                              {
                                    console.log('updating..')
                                    await UpdateFullProduto(mapped);
                              }

                        } catch (error) {
                              log.Error('erro for:' + produto.id + ` ${error} ${error.message}`, 'ImportarProdutosQueue', 'ImportarProdutosQueue', error)
                        }
                  }
            }

      } catch (error) {
            log.Error('erro', 'ImportarProdutosQueue', 'ImportarProdutosQueue', error)
      }

}

// try {

//       const PedidosProdutosId = (await SelectPedidosProdutosID()).map(p => p.id_produto);
//       const ProdutosId = (await SelectProdutosID()).map(p => p.id);
//       let Faltantes = PedidosProdutosId.filter(pp => !ProdutosId.includes(pp))

//       console.log(PedidosProdutosId.length)
//       console.log(ProdutosId.length)
//       console.log(Faltantes.length)

//       for (let index = 0; index < Faltantes.length; index++) {
//             const id = Faltantes[index];

//             if(id <= 0)
//                   continue;

//             console.log('Processando produto:' + id)

//             try {

//                   const resultProdutoIndividual = await BuscarProduto(id);
//                   const produtoToMap = resultProdutoIndividual.retorno.produto;
//                   const mapped = MapProduto(produtoToMap);
//                   const items = MapProdutoPreco(produtoToMap);

//                   const resultBulk1 = await BulkInsertProduto([mapped])
//                   const resultBulk3 = await BulkInsertProdutoPreco([items])
//                   //console.table([resultBulk1, resultBulk3])

//             } catch (error) {
//                   console.log(error)
//             }
//       }

// } catch (error) {
//       console.log(error)

// }