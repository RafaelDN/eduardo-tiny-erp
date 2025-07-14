import axios from "axios";
import { Sleep } from "./helper.js";

function createTinyApi(token) {
  const http = axios.create({
    baseURL: "https://api.tiny.com.br/api2/",
  });

  const BuscarPedidos = async (mapQueryString) => {
    const qs = [];
    for (let [key, value] of mapQueryString) {
      qs.push(`${key}=${value}`);
    }

    await Sleep(3000);
    const { data } = await http.get(
      `pedidos.pesquisa.php?token=${token}&formato=json&${qs.join("&")}`
    );

    return data;
  };

  const BuscarPedido = async (id) => {
    await Sleep(1000);
    const { data } = await http.get(
      `pedido.obter.php?token=${token}&formato=json&id=${id}`
    );

    return data;
  };

  const BuscarProdutos = async (pagina) => {
    await Sleep(1000);
    const { data } = await http.get(
      `pdv.produtos.php?token=${token}&formato=json&pagina=${pagina}`
    );

    return data;
  };

  const BuscarProduto = async (id) => {
    await Sleep(1000);
    const { data } = await http.get(
      `produto.obter.php?token=${token}&formato=json&id=${id}`
    );

    return data;
  };

  const BuscarProdutoEstoque = async (id) => {
    await Sleep(1000);
    const { data } = await http.get(
      `produto.obter.estoque.php?token=${token}&formato=json&id=${id}`
    );

    return data;
  };

  const BuscarProdutoEstoqueQueue = async (mapQueryString) => {
    await Sleep(1000);

    const qs = [];
    for (let [key, value] of mapQueryString) {
      qs.push(`${key}=${value}`);
    }

    const { data } = await http.get(
      `lista.atualizacoes.estoque.php?token=${token}&formato=json&${qs.join(
        "&"
      )}`
    );

    return data;
  };

  const BuscarProdutoAtualizacaoQueue = async (mapQueryString) => {
    await Sleep(1000);

    const qs = [];
    for (let [key, value] of mapQueryString) {
      qs.push(`${key}=${value}`);
    }

    const { data } = await http.get(
      `lista.atualizacoes.produtos.php?token=${token}&formato=json&${qs.join(
        "&"
      )}`
    );

    return data;
  };

  const BuscarContaAPagar = async (mapQueryString) => {
    await Sleep(1000);

    const qs = [];
    for (let [key, value] of mapQueryString) {
      qs.push(`${key}=${value}`);
    }

    const { data } = await http.get(
      `contas.pagar.pesquisa.php?token=${token}&formato=json&${qs.join("&")}`
    );

    return data;
  };

  const BuscarContaAReceber = async (mapQueryString) => {
    await Sleep(1000);

    const qs = [];
    for (let [key, value] of mapQueryString) {
      qs.push(`${key}=${value}`);
    }

    const { data } = await http.get(
      `contas.receber.pesquisa.php?token=${token}&formato=json&${qs.join("&")}`
    );

    return data;
  };

  const BuscarNotaFiscal = async (id) => {
    await Sleep(1000);

    const { data } = await http.get(
      `https://api.tiny.com.br/api2/conta.pagar.obter.php?token=${token}&formato=JSON&id=${id}`
    );

    return data;
  };

  const BuscarNotaFiscalAReceber = async (id) => {
    await Sleep(1000);

    const { data } = await http.get(
      `https://api.tiny.com.br/api2/conta.receber.obter.php?token=${token}&formato=JSON&id=${id}`
    );

    return data;
  };

  return {
    BuscarPedidos,
    BuscarPedido,
    BuscarProdutos,
    BuscarProduto,
    BuscarProdutoEstoque,
    BuscarProdutoEstoqueQueue,
    BuscarProdutoAtualizacaoQueue,
    BuscarContaAPagar,
    BuscarNotaFiscal,
    BuscarContaAReceber,
    BuscarNotaFiscalAReceber,
  };
}

export { createTinyApi };
