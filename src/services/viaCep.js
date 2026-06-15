// Camada de acesso à API do ViaCEP, isolada da UI.
// Normaliza erros num tipo próprio para a camada de componente tratar.

export class CepError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CepError';
  }
}

const BASE_URL = 'https://viacep.com.br/ws';

// Remove tudo que não for dígito (aceita "58015-435" ou "58015435").
export const sanitizeCep = (cep) => String(cep).replace(/\D/g, '');

// Valida o formato: exatamente 8 dígitos.
export const isValidCep = (cep) => /^\d{8}$/.test(sanitizeCep(cep));

/**
 * Busca o endereço de um CEP no ViaCEP.
 * @param {string} cep
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{cep,logradouro,complemento,bairro,localidade,uf}>}
 * @throws {CepError} quando o CEP é inválido ou não foi encontrado.
 */
export async function fetchAddressByCep(cep, { signal } = {}) {
  const clean = sanitizeCep(cep);

  if (!isValidCep(clean)) {
    throw new CepError('O CEP informado é invalido.');
  }

  const response = await fetch(`${BASE_URL}/${clean}/json/`, { signal });

  if (!response.ok) {
    throw new CepError('O CEP informado é invalido.');
  }

  const data = await response.json();

  // O ViaCEP devolve { "erro": true } quando o CEP não existe.
  if (data.erro) {
    throw new CepError('O CEP informado é invalido.');
  }

  return data;
}
