// Importamos uma ferramenta para nos ajudar a falar com o Brevo.


// Esta é a nossa função mágica, o nosso assistente.
// Ela é ativada sempre que alguém preenche o formulário.
exports.handler = async (event) => {
  // 1. Recebemos os dados que o utilizador escreveu (nome e email).
  const { nome, email } = JSON.parse(event.body);

  // 2. Pegamos nos segredos que guardámos no Netlify.
  // Note como não escrevemos a chave ou o ID aqui! É mais seguro.
  const API_KEY = process.env.BREVO_API_KEY;
  const LIST_ID = process.env.BREVO_LIST_ID;

  // 3. Preparamos a mensagem para enviar ao Brevo.
  const contactData = {
    email: email,
    listIds: [parseInt(LIST_ID)], // O Brevo espera que o ID seja um número dentro de uma lista.
    attributes: {
      NOME: nome, // Lembra-se? Tem de ser 'NOME' em maiúsculas!
    },
    updateEnabled: true, // Se a pessoa já existir, atualiza os dados dela.
  };

  // 4. Tentamos contactar o Brevo usando a nossa chave secreta.
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': API_KEY, // A nossa chave mágica!
      },
      body: JSON.stringify(contactData),
    });

    // Se a resposta do Brevo não for "OK", algo deu errado.
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro do Brevo:', errorData);
      // Retornamos uma mensagem de erro.
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Ocorreu um erro ao inscrever.' }),
      };
    }

    // 5. Se tudo correu bem, enviamos uma resposta de sucesso!
    // Esta resposta diz ao navegador do utilizador para ir para a página da oferta especial.
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inscrição bem-sucedida!',
        // MUITO IMPORTANTE: Coloque aqui o link da sua página de oferta especial!
        redirect: '/oferta-especial.html',
      }),
    };
  } catch (error) {
    console.error('Erro na função:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Não foi possível conectar ao serviço.' }),
    };
  }
};
