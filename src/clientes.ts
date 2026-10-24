import { Cliente } from "./types";

// Mínimo 3 clientes iniciales para poder probar el sistema.
export const clientes: Cliente[] = [
  { id: 1, nome: "Ana Souza", email: "ana.souza@email.com" },
  { id: 2, nome: "Carlos Lima", email: "carlos.lima@email.com" },
  { id: 3, nome: "Mariana Rocha", email: "mariana.rocha@email.com" },
];

export function listarClientes(): Cliente[] {
  return clientes;
}

export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((cliente) => cliente.id === id);
}

export function cadastrarCliente(novoCliente: Cliente): Cliente {
  // 1) Nombre y e-mail informados
  if (novoCliente.nome.trim() === "") {
    throw new Error("O nome do cliente deve ser informado.");
  }
  if (novoCliente.email.trim() === "") {
    throw new Error("O e-mail do cliente deve ser informado.");
  }
  // 2) E-mail con formato mínimo válido (tiene @ y punto)
  if (!novoCliente.email.includes("@") || !novoCliente.email.includes(".")) {
    throw new Error("O e-mail informado nao e valido.");
  }
  // 3) id único
  if (buscarClientePorId(novoCliente.id) !== undefined) {
    throw new Error(`Ja existe um cliente com o id ${novoCliente.id}.`);
  }
  // 4) e-mail único (sin importar mayúsculas)
  const emailNovo = novoCliente.email.trim().toLowerCase();
  const emailRepetido = clientes.some(
    (cliente) => cliente.email.toLowerCase() === emailNovo
  );
  if (emailRepetido) {
    throw new Error(`Ja existe um cliente com o e-mail ${novoCliente.email}.`);
  }

  clientes.push(novoCliente);
  return novoCliente;
}