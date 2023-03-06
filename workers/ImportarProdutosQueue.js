import { GetDataCorte, log } from "../helper.js";
import {  UpdateProduto } from "../mysql.js";
import { BuscarProdutoAtualizacaoQueue } from "../tinyapi.js";

export const ImportarProdutosQueue = async () => {

      try {
            const DataCorte = GetDataCorte(10).data;
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
                              console.log(`Processando info ${id}`)
                              const resultBulk1 = await UpdateProduto(id, unidade, preco, preco_promocional, preco_custo, situacao);

                        } catch (error) {
                              log.Error('erro for:' + produto.id, 'ImportarProdutosQueue', 'ImportarProdutosQueue', error)
                        }
                  }
            }

      } catch (error) {
            log.Error('erro', 'ImportarProdutosQueue', 'ImportarProdutosQueue', error)
      }

}