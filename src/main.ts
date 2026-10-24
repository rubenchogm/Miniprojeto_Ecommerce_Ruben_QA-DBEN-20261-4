import {
  listarProdutos,
  buscarProdutoPorId,
  cadastrarProduto,
  atualizarProduto,
  removerProduto,
} from "./produtos";

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

console.log("=== Estado final ===");
console.log(listarProdutos().length, "produtos no catalogo");
console.log(buscarProdutoPorId(2));