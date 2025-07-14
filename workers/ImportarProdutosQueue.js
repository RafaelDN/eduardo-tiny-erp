import { GetDataCorte, log, MapProduto, MapProdutoPreco } from "../helper.js";
import {  BulkInsertProduto, BulkInsertProdutoPreco, SelectProduto, UpdateFullProduto, UpdateProduto } from "../mysql.js";

let config = null;
export const ImportarProdutosQueue = async (_config) => {
      config = _config;
      try {
            const DataCorte = GetDataCorte(5).data;
            console.log(`DataCorte ImportarProdutosQueue`, DataCorte)

            let map = new Map()
            map.set("dataAlteracao", DataCorte);

            while (true) {

                  const data = await config.tinyApi.BuscarProdutoAtualizacaoQueue(map);
                  console.log(data);
                  console.log(data.retorno);
                  const produtos = data.retorno.produtos;

                  if(!produtos || produtos.length <= 0) {
                        log.Info(`Não há produtos para atualizar info`);
                        break;
                  }

                  for (let index = 0; index < produtos.length; index++) {
                        const produto = produtos[index].produto;

                        try {
                              const { id, unidade, preco, preco_promocional,  preco_custo, situacao, preco_custo_medio} = produto;
                              console.log(`Processando precos ${id}`)
                              await UpdateProduto(id, unidade, preco, preco_promocional, preco_custo, preco_custo_medio, situacao);

                              console.log(`Processando info ${id}`)
                              const resultProdutoIndividual = await config.tinyApi.BuscarProduto(id);
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