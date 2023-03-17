import { GetDataCorte, log } from "../helper.js";
import { InsertProdutoEstoque } from "../mysql.js";
import { BuscarProdutoEstoqueQueue } from "../tinyapi.js";

export const ImportarProdutosEstoqueQueue = async () => {

      try {
            const DataCorte = GetDataCorte(5).data;
            console.log(`DataCorte ImportarProdutosEstoqueQueue`, DataCorte)

            let map = new Map()
            map.set("dataAlteracao", DataCorte);

            while (true) {
                  const data = await BuscarProdutoEstoqueQueue(map);
                  const produtos = data.retorno.produtos;

                  if(!produtos || produtos.length <= 0){
                        log.Info(`Não há produtos para atualizar o estoque`);
                        break;
                  }

                  for (let index = 0; index < produtos.length; index++) {
                        const produto = produtos[index].produto;

                        try {
                              const { id, saldo } = produto;
                              console.log(`Processando ${id} saldo ${saldo}`)
                              const resultBulk1 = await InsertProdutoEstoque(id, saldo);
                              //console.table([resultBulk1])

                        } catch (error) {
                              log.Error('erro for:' + produto.id, 'ImportarProdutosEstoqueQueue', 'ImportarProdutosEstoqueQueue', error)
                              console.log(error)
                        }
                  }
            }

      } catch (error) {
            log.Error('erro', 'ImportarProdutosEstoqueQueue', 'ImportarProdutosEstoqueQueue', error)
      }

}