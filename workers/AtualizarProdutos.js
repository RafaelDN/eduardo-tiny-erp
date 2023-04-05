import { MapProduto, Sleep } from "../helper.js";
import { SelectProduto, SelectProdutosID, UpdateFullProduto, UpdateProdutoSituacao } from "../mysql.js";
import { BuscarProduto } from "../tinyapi.js";

const AtualizarProdutos = async () => {

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
                        const mapped = MapProduto(produtoToMap);
                        //const items = MapProdutoPreco(produtoToMap);

                        let produtoCadastro = await SelectProduto(id)
                        console.log(`produtoCadastro`, produtoCadastro)

                        if(produtoCadastro.length <= 0)
                        {
                              // console.log('inserting..')
                              // await BulkInsertProduto([mapped])
                              // await BulkInsertProdutoPreco([items])
                        }
                        else
                        {
                              console.log('updating..')
                              await UpdateFullProduto(mapped);
                        }

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

await AtualizarProdutos();