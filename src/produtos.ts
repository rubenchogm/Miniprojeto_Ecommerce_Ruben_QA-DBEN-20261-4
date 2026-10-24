
import { Produto, Categoria } from "./types";

// Datos iniciales: el "catálogo" vive en este array, en memoria.
// "export" permite que otros archivos (como main.ts) lo usen.
export const produtos: Produto[] = [
  { id: 1, nome: "Teclado Mecanico", categoria: "perifericos", preco: 250, estoque: 15 },
  { id: 2, nome: "Mouse Gamer", categoria: "perifericos", preco: 120, estoque: 30 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "eletronicos", preco: 900, estoque: 8 },
  { id: 4, nome: "Mochila para Notebook", categoria: "acessorios", preco: 150, estoque: 20 },
  { id: 5, nome: "Cabo HDMI", categoria: "acessorios", preco: 35, estoque: 0 },
  { id: 6, nome: "Clean Code", categoria: "livros", preco: 99.9, estoque: 5 },
];

// Devuelve todos los productos.
export function listarProdutos(): Produto[] {
  return produtos;
}

// Busca UN producto por su id. Si no existe, devuelve undefined.
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((produto) => produto.id === id);
}

// Busca productos cuyo nombre CONTENGA el texto (sin importar mayúsculas).
export function buscarProdutosPorNome(nome: string): Produto[] {
  const termo = nome.toLowerCase();
  return produtos.filter((produto) => produto.nome.toLowerCase().includes(termo));
}

// Devuelve solo los productos de una categoría.
export function filtrarProdutosPorCategoria(categoria: Categoria): Produto[] {
  return produtos.filter((produto) => produto.categoria === categoria);
}