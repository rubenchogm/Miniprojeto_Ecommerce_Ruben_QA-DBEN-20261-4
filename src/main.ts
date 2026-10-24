import {
  listarProdutos,
  buscarProdutoPorId,
  buscarProdutosPorNome,
  filtrarProdutosPorCategoria,
} from "./produtos";

console.log("=== Todos os produtos ===");
console.log(listarProdutos());

console.log("=== Buscar por id (2) ===");
console.log(buscarProdutoPorId(2));

console.log("=== Buscar por id inexistente (99) ===");
console.log(buscarProdutoPorId(99));

console.log("=== Buscar por nome ('mouse') ===");
console.log(buscarProdutosPorNome("mouse"));

console.log("=== Filtrar por categoria (acessorios) ===");
console.log(filtrarProdutosPorCategoria("acessorios"));