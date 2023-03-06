import { Sleep } from "../helper.js";
import { SelectProdutosID, UpdateProdutoSituacao } from "../mysql.js";
import { BuscarProduto } from "../tinyapi.js";

const ImportarProdutos = async () => {

      try {
            const ProdutosId = (await SelectProdutosID()).map(p => p.id);

            for (let index = 0; index < ProdutosId.length; index++) {
                  const id = ProdutosId[index];

                  if(id <= 0)
                        continue;

                  console.log('Processando produto:' + id)

                  try {

                        const resultProdutoIndividual = await BuscarProduto(id);
                        const produtoToMap = resultProdutoIndividual.retorno.produto;
                        const { situacao } = produtoToMap;
                        const resultBulk1 = await UpdateProdutoSituacao(id, situacao);
                        console.table([resultBulk1])

                  } catch (error) {
                        console.log(error)
                  }
                  finally
                  {
                        await Sleep(500);
                  }
            }

      } catch (error) {
            console.log(error)

      }
}

await ImportarProdutos();