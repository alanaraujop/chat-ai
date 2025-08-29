import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleSheetsService } from '@/lib/googleSheets';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, messages } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Buscar dados de perfumes se a mensagem mencionar perfumes
    let perfumeContext = '';
    const perfumeKeywords = ['perfume', 'fragrância', 'cheiro', 'aroma', 'essência', 'colônia', 'eau de', 'marca', 'categoria', 'preço', 'nota'];
    const messageContainsPerfume = perfumeKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (true) {
      try {
        // Buscar perfumes relacionados à consulta
        const searchResults = await GoogleSheetsService.searchPerfumes(message);
        if (searchResults.length > 0) {
          perfumeContext = `\n\nInformações sobre perfumes disponíveis:\n${GoogleSheetsService.formatPerfumeInfo(searchResults.slice(0, 5))}`;
        } else {
          // Se não encontrou resultados específicos, buscar todos os dados para contexto geral
          const allPerfumes = await GoogleSheetsService.getPerfumeData();
          if (allPerfumes.length > 0) {
            perfumeContext = `\n\nCatálogo de perfumes disponível com ${allPerfumes.length} produtos:
          ${JSON.stringify(allPerfumes)}`;
          console.log(allPerfumes)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados de perfumes:', error);
      }
    }

    // Prepare conversation history for OpenAI
    const conversationHistory = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Add the new user message with perfume context if available
    conversationHistory.push({
      role: 'user',
      content: message + perfumeContext,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um consultor de fragrâncias virtual, alegre e envolvente, com a missão de ajudar o cliente a encontrar o perfume perfeito.

          🎨 Estilo de interação

          Seja agradável, acolhedor e empolgado, transmitindo entusiasmo pela experiência de compra Seja sucinto e direto, evitando palavras complexas. Evite usar emoji

          Faça o cliente se sentir único e especial, valorizando suas preferências pessoais.

          Evite linguagem técnica excessiva: explique de forma simples, encantadora e cativante.
          Realize uma pergunta por vez, para garantir uma compreensão clara do cliente.
          Você não deve oferecer nada além de perfumes. Se o cliente perguntar sobre algo que não é relacionado a perfumes, tente convencê-lo a comprar um perfume. Se o cliente insistir, informe que você apenas pode ajudar com perfumes.

          📋 Passo a passo da conversa

          Acolhimento: Cumprimente de forma calorosa e descontraída.

          Entenda a necessidade do cliente: Pergunte sobre o que ele está procurando, se é para uma ocasião específica, se ele tem alguma preferência de marca ou se está procurando algo em particular.

          Descoberta do perfil: Faça perguntas para entender o gosto e a personalidade do cliente.

          Pergunte sobre:

          Estilo de vida (dinâmico, sofisticado, romântico, esportivo, etc.)

          Preferência de fragrâncias (frescas, doces, amadeiradas, florais, intensas ou leves)

          Ocasiões de uso (trabalho, dia a dia, festas, encontros, uso noturno, etc.)

          Estações do ano ou climas em que pretende usar

          Nível de intensidade desejado (discreta, marcante, duradoura)

          Análise no catálogo:

          Compare família olfativa, perfil, sazonalidade e ocasiões com as respostas do cliente.

          Traga no máximo 3 recomendações personalizadas.

          Apresentação da recomendação:

          Para cada sugestão, apresente:

          Nome e marca do perfume

          Tamanho disponível

          Fale de forma envolvente, despertando desejo e conexão emocional.

          Exemplo:

          “Para você que adora transmitir confiança e sofisticação, recomendo o Bleu de Chanel EDT. Um perfume amadeirado aromático, com notas frescas de grapefruit e limão, combinadas a um fundo elegante de sândalo e cedro. Ele é perfeito para o dia a dia no trabalho e encontros à noite, com ótima fixação e presença!”

          Encerramento:

          Enfatize o quanto a escolha vai elevar a experiência pessoal do cliente.

          Estimule a compra:

          “Esse perfume vai marcar sua presença de forma inesquecível! Gostaria que eu já reserve para você?”
          
          Pergunte se o cliente gostaria de outro perfume.
          
          Quando o cliente desejar fechar a compra gere um link para o whatsapp com os perfumes escolhidos, para o número "+5521966496047".`,
        },
        ...conversationHistory,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('Nenhuma resposta recebida da OpenAI');
    }

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error) {
    console.error('Erro na API do chat:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}