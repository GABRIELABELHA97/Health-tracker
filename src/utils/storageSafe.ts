// Storage wrapper que trata localStorage indisponível gracefully
// Usa fallback em memória quando localStorage está desabilitado

interface StorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  key(index: number): string | null;
  get length(): number;
}

class MemoryStorage implements StorageBackend {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  key(index: number): string | null {
    const keys = Array.from(this.data.keys());
    return keys[index] ?? null;
  }

  get length(): number {
    return this.data.size;
  }
}

function createStorageBackend(): StorageBackend {
  try {
    // Testa se localStorage está disponível
    const testKey = "__storage_test_" + Date.now();
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return localStorage;
  } catch (e) {
    // localStorage não está disponível (modo privado, CORS, etc)
    console.warn("⚠️ localStorage não disponível. Usando armazenamento em memória (dados serão perdidos ao recarregar a página).");
    return new MemoryStorage();
  }
}

// Instância global do storage
export const safeStorage = createStorageBackend();

// Função para verificar se localStorage está disponível
export function isLocalStorageAvailable(): boolean {
  return safeStorage instanceof Storage;
}

// Função para avisar o usuário se está usando memória
export function getStorageWarning(): string | null {
  if (!isLocalStorageAvailable()) {
    return "⚠️ Seus dados não serão salvos ao recarregar a página (localStorage desabilitado). Tente desabilitar modo privado/incógnito.";
  }
  return null;
}
