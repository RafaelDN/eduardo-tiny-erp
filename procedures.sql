CREATE DEFINER=`goperacaocom_teste`@`201.22.12.43` PROCEDURE `InsertProdutoEstoque`(in idParam int, in saldoParam int)
BEGIN

SET @existe = (select id from produtos_estoque where id = idParam limit 0, 1);

IF @existe is null THEN
	insert produtos_estoque values (idParam, saldoParam);
ELSE
	update produtos_estoque
    set estoque_saldo = saldoParam
    where id = idParam;
END IF;

END






CREATE DEFINER=`goperacaocom_teste`@`177.16.132.53` PROCEDURE `updateProduto`(in idParam int, in unidadeParam varchar(10), in precoParam decimal(10,2),in precoPromocionalParam decimal(10,2),in custoParam decimal(10,2), in situacaoParam varchar(25))
BEGIN

update produtos 
	set unidade = unidadeParam,
    situacao = situacaoParam,
    data_alteracao = now()
where id = idParam;

update produtos_preco 
	set 
    preco = precoParam,
    preco_promocional = precoPromocionalParam,
    preco_custo = precoPromocionalParam
where id = idParam;

END