import { Produto } from "./types";
import { listarProdutos } from "./produtos";
import { buscarClientePorId } from "./clientes";
import { consultarPedidos } from "./pedidos";

// Formata um número como moeda brasileira. Ex.: 1234.5 -> "R$ 1.234,50"
function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------- Tipos dos relatórios ----------
export type VendaPorProduto = {
  produtoId: number;
  nome: string;
  quantidadeVendida: number;
  receita: number;
};

export type VendaPorCliente = {
  clienteId: number;
  nome: string;
  quantidadePedidos: number;
  totalGasto: number;
};

// ---------- Cálculos (consolidação dos dados) ----------

// Soma o total de todos os pedidos.
export function calcularTotalVendas(): number {
  return consultarPedidos().reduce((soma, pedido) => soma + pedido.total, 0);
}

// Quantas unidades foram vendidas de cada produto e quanto dinheiro cada um gerou.
export function calcularVendasPorProduto(): VendaPorProduto[] {
  const resultado: VendaPorProduto[] = [];

  for (const pedido of consultarPedidos()) {
    for (const item of pedido.itens) {
      const existente = resultado.find((r) => r.produtoId === item.produtoId);
      const receitaItem = item.precoUnitario * item.quantidade;

      if (existente !== undefined) {
        existente.quantidadeVendida += item.quantidade;
        existente.receita += receitaItem;
      } else {
        resultado.push({
          produtoId: item.produtoId,
          nome: item.nome,
          quantidadeVendida: item.quantidade,
          receita: receitaItem,
        });
      }
    }
  }

  // Ordenados da maior para a menor quantidade vendida.
  return resultado.sort((a, b) => b.quantidadeVendida - a.quantidadeVendida);
}

// Quantos pedidos cada cliente fez e quanto gastou no total.
export function calcularVendasPorCliente(): VendaPorCliente[] {
  const resultado: VendaPorCliente[] = [];

  for (const pedido of consultarPedidos()) {
    const existente = resultado.find((r) => r.clienteId === pedido.clienteId);

    if (existente !== undefined) {
      existente.quantidadePedidos += 1;
      existente.totalGasto += pedido.total;
    } else {
      resultado.push({
        clienteId: pedido.clienteId,
        nome: buscarClientePorId(pedido.clienteId)?.nome ?? "Cliente desconhecido",
        quantidadePedidos: 1,
        totalGasto: pedido.total,
      });
    }
  }

  return resultado.sort((a, b) => b.totalGasto - a.totalGasto);
}

// Produtos com pouco estoque (por padrão, 5 unidades ou menos).
export function listarProdutosEstoqueBaixo(limite: number = 5): Produto[] {
  return listarProdutos().filter((produto) => produto.estoque <= limite);
}

// ---------- Apresentação (imprime os relatórios no terminal) ----------
export function exibirRelatorios(): void {
  const pedidos = consultarPedidos();

  console.log("\n########## RELATÓRIOS ##########");

  console.log("\n--- Resumo de vendas ---");
  console.log(`Pedidos realizados: ${pedidos.length}`);
  console.log(`Total vendido: ${formatarMoeda(calcularTotalVendas())}`);

  console.log("\n--- Vendas por produto ---");
  for (const venda of calcularVendasPorProduto()) {
    console.log(
      `${venda.nome}: ${venda.quantidadeVendida} un. | receita ${formatarMoeda(venda.receita)}`
    );
  }

  console.log("\n--- Vendas por cliente ---");
  for (const venda of calcularVendasPorCliente()) {
    console.log(
      `${venda.nome}: ${venda.quantidadePedidos} pedido(s) | total ${formatarMoeda(venda.totalGasto)}`
    );
  }

  console.log("\n--- Estoque atual ---");
  for (const produto of listarProdutos()) {
    console.log(`${produto.nome}: ${produto.estoque} un.`);
  }

  console.log("\n--- Produtos com estoque baixo (5 ou menos) ---");
  const baixos = listarProdutosEstoqueBaixo();
  if (baixos.length === 0) {
    console.log("Nenhum produto com estoque baixo.");
  } else {
    for (const produto of baixos) {
      console.log(`${produto.nome}: ${produto.estoque} un.`);
    }
  }
}
