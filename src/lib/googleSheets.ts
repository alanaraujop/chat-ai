interface PerfumeData {
  nome: string;
  marca: string;
  genero: string;
  concentracao: string;
  notas_topo: string;
  notas_coracao: string;
  notas_fundo: string;
  familia_olfativa: string;
  perfil: string;
  silage: string;
  duracao: string;
  tamanho_ml: string;
  sazonalidade: string;
  ocasioes: string;
  preco: string;
  disponibilidade: string;
}

export class GoogleSheetsService {
  private static readonly SHEET_URL = 'https://docs.google.com/spreadsheets/d/18idP4V7Xzy85fmbaUTXQd_JQn_DU0jdHL-jKOL8SjV4/export?format=csv';
  private static cache: PerfumeData[] | null = null;
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static async getPerfumeData(): Promise<PerfumeData[]> {
    const now = Date.now();
    
    // Retorna cache se ainda válido
    if (this.cache && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await fetch(this.SHEET_URL);
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const csvText = await response.text();
      const data = this.parseCSV(csvText);
      
      this.cache = data;
      this.lastFetch = now;
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados da planilha:', error);
      // Retorna cache antigo se houver erro
      return this.cache || [];
    }
  }

  private static parseCSV(csvText: string): PerfumeData[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: PerfumeData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length >= 6) {
        data.push({
          nome: values[1] || '',
          marca: values[2] || '',
          genero: values[3] || '',
          concentracao: values[4] || '',
          notas_topo: values[5] || '',
          notas_coracao: values[6] || '',
          notas_fundo: values[7] || '',
          familia_olfativa: values[8] || '',
          perfil: values[9] || '',
          silage: values[10] || '',
          duracao: values[11] || '',
          tamanho_ml: values[12] || '',
          preco: values[13] || '',
          disponibilidade: values[14] || 'Disponível',
          sazonalidade: values[15] || '',
          ocasioes: values[16] || ''
        });
      }
    }

    return data;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static async searchPerfumes(query: string): Promise<PerfumeData[]> {
    const data = await this.getPerfumeData();
    const searchTerm = query.toLowerCase();
    
    return data.filter(perfume => 
      perfume.nome.toLowerCase().includes(searchTerm) ||
      perfume.marca.toLowerCase().includes(searchTerm)
    );
  }

  static async getPerfumesByBrand(brand: string): Promise<PerfumeData[]> {
    const data = await this.getPerfumeData();
    return data.filter(perfume => 
      perfume.marca.toLowerCase().includes(brand.toLowerCase())
    );
  }

  static formatPerfumeInfo(perfumes: PerfumeData[]): string {
    if (perfumes.length === 0) {
      return 'Nenhum perfume encontrado com os critérios especificados.';
    }

    return perfumes.map(perfume => {
      return `**${perfume.nome}** (${perfume.marca})\n` +
             `Preço: ${perfume.preco}\n` +
             `Disponibilidade: ${perfume.disponibilidade}\n`;
    }).join('\n---\n\n');
  }
}