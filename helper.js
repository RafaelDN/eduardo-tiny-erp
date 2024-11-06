export const Sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const StringToUSDate = (value) => {
  try {

    var data = value.split('/');
    var stringFormatada = data[1] + '-' + data[0] + '-' +  data[2];
    var dataFormatada1 = new Date(stringFormatada);

    return dataFormatada1.toISOString();
  } catch (error) {
    //console.log("StringToUSDate", error);
  }
  return "";
};

export const  MapPedido = (pedidoToMap) => {
  return {
        id: pedidoToMap.id,
        numero: pedidoToMap.numero,
        numero_ecommerce: pedidoToMap.numero_ecommerce || '',
        data_pedido: StringToUSDate(pedidoToMap.data_pedido),
        data_prevista: StringToUSDate(pedidoToMap.data_prevista),
        data_faturamento: StringToUSDate(pedidoToMap.data_faturamento),
        data_envio: StringToUSDate(pedidoToMap.data_envio),
        data_entrega: StringToUSDate(pedidoToMap.data_entrega),
        valor_frete: pedidoToMap.valor_frete,
        valor_desconto: pedidoToMap.valor_desconto,
        outras_despesas: pedidoToMap.outras_despesas,
        total_produtos: pedidoToMap.total_produtos,
        total_pedido: pedidoToMap.total_pedido,
        numero_ordem_compra: pedidoToMap.numero_ordem_compra,
        nomeEcommerce: pedidoToMap.ecommerce?.nomeEcommerce || '',
        situacao: pedidoToMap.situacao,
        id_nota_fiscal: pedidoToMap.id_nota_fiscal,
        id_natureza_operacao: pedidoToMap.id_natureza_operacao,
        id_vendedor: pedidoToMap.id_vendedor
  };
}

export const  MapPedidoClient = (pedidoToMap) => {
  return {
        id: pedidoToMap.id,
        nome: pedidoToMap.cliente.nome,
        codigo: pedidoToMap.cliente.codigo,
        nome_fantasia: pedidoToMap.cliente.nome_fantasia || "",
        tipo_pessoa: pedidoToMap.cliente.tipo_pessoa,
        cpf_cnpj: pedidoToMap.cliente.cpf_cnpj,
        ie: pedidoToMap.cliente.ie,
        rg: pedidoToMap.cliente.rg,
        endereco: pedidoToMap.cliente.endereco,
        numero: pedidoToMap.cliente.numero,
        complemento: pedidoToMap.cliente.complemento,
        bairro: pedidoToMap.cliente.bairro,
        cidade: pedidoToMap.cliente.cidade,
        uf: pedidoToMap.cliente.uf,
        fone: pedidoToMap.cliente.fone,
        email: pedidoToMap.cliente.email,
        cep: pedidoToMap.cliente.cep,
  };
}

export const  MapPedidoItems = (pedidoToMap) => {
  return pedidoToMap.itens.map((item) => {
        return {
              id: pedidoToMap.id,
              id_produto: item.item.id_produto,
              codigo: item.item.codigo,
              descricao: item.item.descricao,
              unidade: item.item.unidade || ``,
              quantidade: parseInt(item.item.quantidade),
              valor_unitario: parseFloat(item.item.valor_unitario),
        };
  });
}

export function MapProduto(produto) {
  return {
        id : produto.id,
        nome : produto.nome,
        codigo : produto.codigo,
        unidade : produto.unidade,
        ncm : produto.ncm,
        origem : produto.origem,
        gtin : produto.gtin,
        gtin_embalagem : produto.gtin_embalagem,
        localizacao : produto.localizacao,
        peso_liquido : produto.peso_liquido,
        peso_bruto : produto.peso_bruto,
        id_fornecedor : produto.id_fornecedor,
        nome_fornecedor : produto.nome_fornecedor,
        codigo_fornecedor : produto.codigo_fornecedor,
        codigo_pelo_fornecedor : produto.codigo_pelo_fornecedor,
        unidade_por_caixa : produto.unidade_por_caixa,
        marca : produto.marca,
        tipoEmbalagem : produto.tipoEmbalagem,
        alturaEmbalagem : produto.alturaEmbalagem,
        comprimentoEmbalagem : produto.comprimentoEmbalagem,
        larguraEmbalagem : produto.larguraEmbalagem,
        diametroEmbalagem : produto.diametroEmbalagem,
        qtd_volumes : produto.qtd_volumes,
        categoria : produto.categoria,
        situacao: produto.situacao,
  };
}

function MapProdutoEstoque(produto) {
  return {
        id : produto.id,
        estoque_minimo: produto.estoque_minimo,
        estoque_maximo: produto.estoque_maximo
  };
}


export function MapProdutoPreco(produto) {
  return {
        id: produto.id,
        preco: produto.preco,
        preco_promocional: produto.preco_promocional,
        valor_ipi_fixo: produto.valor_ipi_fixo,
        preco_custo: produto.preco_custo,
        preco_custo_medio: produto.preco_custo_medio,
  };
}

export function MapearNota(nf1) {
  return {
    id: nf1.id,
    data: StringToUSDate(nf1.data),
    vencimento: StringToUSDate(nf1.vencimento),
    valor: nf1.valor,
    nro_documento: nf1.nro_documento,
    competencia: nf1.competencia,
    cliente_cod: nf1.cliente.codigo,
    cliente_nome: nf1.cliente.nome,
    cliente_cpf_cnpj: nf1.cliente.cpf_cnpj,
    historico: nf1.historico,
    categoria: nf1.categoria,
    situacao: nf1.situacao,
    ocorrencia: nf1.ocorrencia,
    dia_vencimento: nf1.dia_vencimento,
    liquidacao: StringToUSDate(nf1.liquidacao),
    saldo: nf1.saldo,
  };
}


const options = {
  folderPath: './logs/',
  dateBasedFileNaming: true,
  fileNamePrefix: 'DailyLogs_',
  fileNameExtension: '.log',
  timeZone: 'America/Sao_Paulo',
  dateFormat: 'YYYY_MM_D',
  timeFormat: 'h:mm:ss A',
  onlyFileLogging: false
}

import log from 'node-file-logger'
log.SetUserOptions(options);
export { log };


import * as dotenv from 'dotenv'
dotenv.config();
const env = process.env;
export { env };


export function GetDataCorte(diasParaTras) {
  var date = new Date()
  var yesterday = new Date(date.getTime());
  yesterday.setDate(date.getDate() - diasParaTras);

  return {
    data: yesterday.toLocaleDateString("pt-BR")
  }
}

export async function execFunc(func, config)
{
  try {
        log.Info(`execFunc ${func.name}`);
        await func(config);
  } catch (error) {
        log.Error(`execFunc ${func.name}`, 'index.js', func.name, error);
  }
}