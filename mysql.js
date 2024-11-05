import mysql from 'mysql'
import { env } from './helper.js';
import fs from 'fs'

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

const Ping = async ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.ping(function (error) {
                  connection.destroy();

                  if(error) e(error)
                  s(true)
            });

      })
}

const UpdateProcedures = async (nome)  => {

      return new Promise((s, e) => {

            const createPrceduresScript = fs.readFileSync('procedures.sql', 'utf-8');

            console.log('createPrceduresScript', createPrceduresScript);

            // const connection = createConn()
            // connection.connect();
            // connection.query(createPrceduresScript, function (error, results2) {
            //       console.log('UpdateProcedures', error, results2)

            //       connection.destroy();

            //       if(error) e(error)
            //       s(results2)

            // });

      })
}


// const CheckProceduresExists = async (nome)  => {

//       return new Promise((s, e) => {

//             console.log('CheckProceduresExists')
//             const connection = createConn()
//             connection.connect();
//             connection.query(`SHOW CREATE PROCEDURE ${nome}`, function (error, results2) {
//                   console.log('CheckProceduresExists', error, results2)

//                   connection.destroy();

//                   if(error) e(error)
//                   s(results2)

//             });

//       })
// }

const CheckProceduresExists = async (nome)  => {

      return new Promise((s, e) => {

            console.log('CheckProceduresExists')
            const connection = createConn()
            connection.connect();
            connection.query(`SELECT ROUTINE_DEFINITION FROM information_schema.ROUTINES WHERE SPECIFIC_NAME='${nome}'`, function (error, results2) {
                  console.log('CheckProceduresExists', error, results2)

                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}



const SelectProduto = async (id)  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('SELECT * FROM produtos where id = ?', id, function (error, results2, fields) {
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
            connection.query('SELECT id, situacao FROM pedidos order by id desc limit 0, 500000', function (error, results2, fields) {
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
const SPTeste = ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query(`call SPTeste`,
            function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}




const UpdateProduto = (id, unidadeParam, precoParam, precoPromocionalParam, custoParam, precoCustoMedioParam, situacao)  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query(`call updateProdutoV2(?,?,?,?,?,?,?)`, [id, unidadeParam, precoParam, precoPromocionalParam, custoParam, precoCustoMedioParam, situacao],
            function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}

const UpdateProdutoSituacao = (id, situacao)  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query(`update produtos set situacao = ?, data_alteracao = now() where id = ?`, [situacao, id],
            function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}

const SelectContasAPagarID = ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('select distinct id from contas_a_pagar_teste', function (error, results2, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results2)

            });

      })
}

const SelectContasAReceberID = ()  => {

      return new Promise((s, e) => {

            const connection = createConn()
            connection.connect();
            connection.query('select distinct id from contas_a_receber_teste', function (error, results2, fields) {
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

const BulkInsertContasAPagar = async (contas)  =>{
      return await BulkInsertQuery('contas_a_pagar_teste', contas)
}

const BulkInsertContasAReceber = async (contas)  =>{
      return await BulkInsertQuery('contas_a_receber_teste', contas)
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

const UpdateFullPedido = (target)  =>{

      return new Promise((s, e) => {

            var values = Object.keys(target)
                  .filter(key => key != 'id')
                  .map(key => ({key, value:target[key]}));

            const connection = createConn()
            connection.connect();
            connection.query(`update pedidos set ${values.map(v => `${v.key} = ?`)}, data_alteracao = now() where id = ?`, [...values.map(v => v.value), target.id], function(error, results, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results);

            });

      });


}

const UpdateFullProduto = (target)  =>{

      return new Promise((s, e) => {

            var values = Object.keys(target)
                  .filter(key => key != 'id')
                  .map(key => ({key, value:target[key]}));

            const connection = createConn()
            connection.connect();
            connection.query(`update produtos set ${values.map(v => `${v.key} = ?`)}, data_alteracao = now() where id = ?`, [...values.map(v => v.value), target.id], function(error, results, fields) {
                  connection.destroy();

                  if(error) e(error)
                  s(results);

            });

      });


}


export {
      Ping,
      CheckProceduresExists,

      SelectProduto,
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
      UpdateProduto,
      UpdateProdutoSituacao,

      UpdateFullPedido,
      UpdateFullProduto,

      SPTeste,
      UpdateProcedures,

      SelectContasAPagarID,
      BulkInsertContasAPagar,

      SelectContasAReceberID,
      BulkInsertContasAReceber
}

