import {
  listarProdutos,
  buscarProdutoPorId,
  cadastrarProduto,
  atualizarProduto,
  removerProduto,
} from "./produtos";
import { listarClientes, buscarClientePorId, cadastrarCliente } from "./clientes";
import {
  adicionarAoCarrinho,
  removerDoCarrinho,
  alterarQuantidade,
  listarItensCarrinho,
  calcularTotalCarrinho,
} from "./carrinho";

// Ejecuta una acción; si lanza un error, lo muestra en lugar de detener el programa.
function tentar(descricao: string, acao: () => unknown): void {
  try {
    const resultado = acao();
    console.log(`OK - ${descricao}`, resultado);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.log(`ERRO - ${descricao}: ${mensagem}`);
  }
}

// ==================== PRODUTOS ====================
console.log("=== Cadastro valido ===");
tentar("cadastrar Webcam", () =>
  cadastrarProduto({ id: 7, nome: "Webcam HD", categoria: "perifericos", preco: 180, estoque: 12 })
);

console.log("=== Cadastros invalidos ===");
tentar("preco negativo", () =>
  cadastrarProduto({ id: 8, nome: "Produto X", categoria: "livros", preco: -10, estoque: 5 })
);
tentar("nome vazio", () =>
  cadastrarProduto({ id: 9, nome: "   ", categoria: "livros", preco: 10, estoque: 5 })
);
tentar("estoque negativo", () =>
  cadastrarProduto({ id: 10, nome: "Produto Y", categoria: "livros", preco: 10, estoque: -1 })
);
tentar("id repetido", () =>
  cadastrarProduto({ id: 1, nome: "Outro Teclado", categoria: "perifericos", preco: 100, estoque: 3 })
);

console.log("=== Atualizar ===");
tentar("atualizar preco do produto 2", () => atualizarProduto(2, { preco: 110 }));
tentar("atualizar com preco zero", () => atualizarProduto(2, { preco: 0 }));
tentar("atualizar produto inexistente", () => atualizarProduto(99, { preco: 10 }));

console.log("=== Remover ===");
tentar("remover produto 7", () => removerProduto(7));
tentar("remover produto inexistente", () => removerProduto(99));

console.log("=== Estado final dos produtos ===");
console.log(listarProdutos().length, "produtos no catalogo");
console.log(buscarProdutoPorId(2));

// ==================== CLIENTES ====================
console.log("=== Clientes ===");
console.log(listarClientes());
console.log(buscarClientePorId(2));
tentar("cadastrar cliente valido", () =>
  cadastrarCliente({ id: 4, nome: "Pedro Alves", email: "pedro.alves@email.com" })
);
tentar("cliente sem nome", () => cadastrarCliente({ id: 5, nome: "", email: "x@email.com" }));
tentar("cliente sem e-mail", () => cadastrarCliente({ id: 6, nome: "Joao", email: "" }));
tentar("cliente com e-mail invalido", () => cadastrarCliente({ id: 7, nome: "Joao", email: "joao-email" }));
tentar("cliente com id repetido", () => cadastrarCliente({ id: 1, nome: "Outro", email: "outro@email.com" }));
tentar("cliente com e-mail repetido", () => cadastrarCliente({ id: 8, nome: "Outra Ana", email: "ANA.SOUZA@email.com" }));
console.log(listarClientes().length, "clientes cadastrados");

// ==================== CARRINHO ====================
console.log("=== Carrinho ===");
tentar("adicionar 2 mouses (cliente 1)", () => adicionarAoCarrinho(1, 2, 2));
tentar("adicionar 1 teclado", () => adicionarAoCarrinho(1, 1, 1));
tentar("adicionar mais 1 mouse (soma na mesma linha)", () => adicionarAoCarrinho(1, 2, 1));
console.log(listarItensCarrinho(1));
console.log("Total:", calcularTotalCarrinho(1));
tentar("alterar quantidade do mouse para 5", () => alterarQuantidade(1, 2, 5));
console.log("Total:", calcularTotalCarrinho(1));
tentar("quantidade zero", () => adicionarAoCarrinho(1, 2, 0));
tentar("quantidade negativa", () => adicionarAoCarrinho(1, 2, -3));
tentar("produto inexistente", () => adicionarAoCarrinho(1, 99, 1));
tentar("acima do estoque", () => adicionarAoCarrinho(1, 3, 50));
tentar("cliente inexistente", () => adicionarAoCarrinho(99, 1, 1));
tentar("remover o teclado", () => removerDoCarrinho(1, 1));
tentar("remover item que nao esta", () => removerDoCarrinho(1, 6));
console.log(listarItensCarrinho(1));
console.log("Total final:", calcularTotalCarrinho(1));