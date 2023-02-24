import mysql from 'mysql'
import { env } from './helper.js';

const createConn = () => {
      return mysql.createConnection({
            host     : env.DB_HOST,
            user     : env.DB_USER,
            password : env.DB_PASSWORD,
            database : env.DB_NAME,
            connectionLimit : 1000,
            connectTimeout  : 60 * 60 * 1000,
            acquireTimeout  : 60 * 60 * 1000,
            timeout         : 60 * 60 * 1000,
          });
}

const SelectPedido = async (pedidoID)  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('SELECT * FROM pedidos_itens where id = ?', pedidoID, function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}

const SelectPedidos = ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('SELECT id FROM pedidos limit 0, 500000', function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })

}

const SelectProdutosID = ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('select distinct id from produtos limit 0,500000', function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}

const SelectPedidosProdutosID = ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('select distinct id_produto from pedidos_itens limit 0,500000', function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}



const InsertProdutoEstoque = (id, saldo)  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query(`call InsertProdutoEstoque(?,?)`, [id, saldo],
            function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}

const UpdateProduto = (id, unidadeParam, precoParam, precoPromocionalParam, custoParam)  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query(`call updateProduto(?,?,?,?,?)`, [id, unidadeParam, precoParam, precoPromocionalParam, custoParam],
            function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}


const BulkInsertPedido = async (pedidos)  => {
      return await BulkInsertQuery('pedidos', pedidos)
}

const BulkInsertPedidoCliente = async (pedidos)  =>{
      return await BulkInsertQuery('pedidos_clientes', pedidos)
}

const BulkInsertPedidoItems = async (pedidos)  =>{
      return await BulkInsertQuery('pedidos_itens', pedidos)
}

const BulkInsertProduto = async (produtos)  => {
      return await BulkInsertQuery('produtos', produtos)
}

const BulkInsertProdutoEtoque = async (produtos)  =>{
      return await BulkInsertQuery('produtos_estoque', produtos)
}

const BulkInsertProdutoPreco = async (produtos)  =>{
      return await BulkInsertQuery('produtos_preco', produtos)
}

const BulkInsertQuery = (tableName, pedidos)  =>{

      return new Promise((s, e) => {

            var keys = Object.keys(pedidos[0]).join(',')
            var values = pedidos.map(p => Object.values(p))

            const connection = createConn()
            connection.connect();
            connection.query(`INSERT INTO ${tableName} (${keys}) VALUES ?`, [values], function(error, results, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results);

            });

      });


}


export {
      SelectPedido,
      SelectPedidos,
      BulkInsertPedido,
      BulkInsertPedidoCliente,
      BulkInsertPedidoItems,

      SelectProdutosID,
      SelectPedidosProdutosID,
      BulkInsertProduto,
      BulkInsertProdutoEtoque,
      BulkInsertProdutoPreco,

      InsertProdutoEstoque,
      UpdateProduto
}

