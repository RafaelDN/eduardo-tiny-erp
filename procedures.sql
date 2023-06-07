USE `goperacaocom_dudu`;
DROP procedure IF EXISTS `InsertProdutoEstoque`;

DELIMITER $$
USE `goperacaocom_dudu`$$
CREATE PROCEDURE `InsertProdutoEstoque` (in idParam int, in saldoParam int)
BEGIN

SET @existe = (select id from produtos_estoque where id = idParam limit 0, 1);

IF @existe is null THEN
	insert produtos_estoque (id, estoque_saldo, data_alteracao) values (idParam, saldoParam, now());
ELSE
	update produtos_estoque
    set estoque_saldo = saldoParam,
    data_alteracao = now()
    where id = idParam;
END IF;

END$$

DELIMITER ;







USE `goperacaocom_dudu`;
DROP procedure IF EXISTS `updateProduto`;

DELIMITER $$
USE `goperacaocom_dudu`$$
CREATE PROCEDURE `updateProdutoV2` (
    in idParam int,
    in unidadeParam varchar(10), 
    in precoParam decimal(10,2),
    in precoPromocionalParam decimal(10,2),
    in custoParam decimal(10,2), 
    in precoCustoMedioParam decimal(10,2), 
    in situacaoParam varchar(25)
)
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
    preco_custo = custoParam,
    preco_custo_medio = precoCustoMedioParam,
    data_alteracao = now()
where id = idParam;

END$$

DELIMITER ;

