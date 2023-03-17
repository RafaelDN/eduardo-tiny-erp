import { MapProduto, MapProdutoPreco } from "../helper.js";
import { BulkInsertProduto, BulkInsertProdutoPreco, SelectPedidosProdutosID, SelectProdutosID } from "../mysql.js";
import { BuscarProduto } from "../tinyapi.js";

export const ImportarProdutos = async () => {

      try {

            const PedidosProdutosId = (await SelectPedidosProdutosID()).map(p => p.id_produto);
            const ProdutosId = (await SelectProdutosID()).map(p => p.id);
            let Faltantes = PedidosProdutosId.filter(pp => !ProdutosId.includes(pp))

            console.log(PedidosProdutosId.length)
            console.log(ProdutosId.length)
            console.log(Faltantes.length)

            for (let index = 0; index < Faltantes.length; index++) {
                  const id = Faltantes[index];

                  if(id <= 0)
                        continue;

                  console.log('Processando produto:' + id)

                  try {

                        const resultProdutoIndividual = await BuscarProduto(id);
                        const produtoToMap = resultProdutoIndividual.retorno.produto;
                        const mapped = MapProduto(produtoToMap);
                        const items = MapProdutoPreco(produtoToMap);

                        const resultBulk1 = await BulkInsertProduto([mapped])
                        const resultBulk3 = await BulkInsertProdutoPreco([items])
                        //console.table([resultBulk1, resultBulk3])

                  } catch (error) {
                        console.log(error)
                  }
            }

      } catch (error) {
            console.log(error)

      }
}