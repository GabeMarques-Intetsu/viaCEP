import { useRef, useState } from 'react';
import { CepError, fetchAddressByCep, sanitizeCep } from './services/viaCep.js';

const EMPTY_ADDRESS = {
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  state: '',
  city: '',
};

// Aplica a máscara visual "00000-000" enquanto o usuário digita.
function maskCep(value) {
  const digits = sanitizeCep(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function App() {
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cancela requisição anterior caso o usuário busque outro CEP rapidamente.
  const controllerRef = useRef(null);
  // Evita refazer a mesma busca (ex.: chegar a 8 dígitos e depois sair do campo).
  const lastSearchedRef = useRef('');

  const handleCepChange = (event) => {
    const masked = maskCep(event.target.value);
    setAddress((prev) => ({ ...prev, cep: masked }));
    if (error) setError(false);

    const clean = sanitizeCep(masked);
    // Assim que o CEP fica completo (8 dígitos), busca automaticamente —
    // sem precisar de Tab/blur.
    if (clean.length === 8) {
      searchCep(clean);
    } else {
      lastSearchedRef.current = '';
    }
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // Busca o endereço no ViaCEP e preenche os campos.
  const searchCep = async (clean) => {
    // Não repete a busca do mesmo CEP já consultado.
    if (clean === lastSearchedRef.current) return;
    lastSearchedRef.current = clean;

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(false);

      const data = await fetchAddressByCep(clean, {
        signal: controllerRef.current.signal,
      });

      setAddress((prev) => ({
        ...prev,
        cep: maskCep(data.cep),
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      }));
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (err instanceof CepError) {
        // Limpa os campos de endereço e sinaliza o erro.
        setAddress((prev) => ({
          ...EMPTY_ADDRESS,
          cep: prev.cep,
        }));
        setError(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Address</h2>

        <input
          type="text"
          id="cep"
          placeholder="CEP"
          value={address.cep}
          onChange={handleCepChange}
          maxLength={9}
          className={error ? 'input-cep-error' : undefined}
          aria-invalid={error}
          aria-describedby="cepError"
        />

        <div id="cepError" className={error ? '' : 'hidden'}>
          O CEP informado é invalido.
        </div>

        <input
          type="text"
          id="street"
          placeholder="Rua"
          value={address.street}
          onChange={handleFieldChange('street')}
        />
        <input
          type="text"
          id="number"
          placeholder="Número"
          value={address.number}
          onChange={handleFieldChange('number')}
        />
        <input
          type="text"
          id="neighborhood"
          placeholder="Bairro"
          value={address.neighborhood}
          onChange={handleFieldChange('neighborhood')}
        />
        <input
          type="text"
          id="state"
          placeholder="Estado"
          value={address.state}
          onChange={handleFieldChange('state')}
        />
        <input
          type="text"
          id="city"
          placeholder="Cidade"
          value={address.city}
          onChange={handleFieldChange('city')}
        />

        {loading && <span className="loading">Buscando endereço…</span>}
      </form>
    </main>
  );
}
