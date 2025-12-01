// 🚨 Importante: Certifique-se de que a sua variável 'data'
// (sua estrutura da prancha em Português) esteja definida e acessível.

/**
 * Função placeholder: Você deve substituir o corpo desta função 
 * pelo seu código real de renderização da prancha na tela.
 * * @param {object} translatedStructure - O objeto 'data' com os labels traduzidos.
 */
const renderBoard = (translatedStructure) => {
    // 🚨 SUBSTITUA este bloco (apenas o bloco de código) pela sua 
    // função real que desenha os botões na tela usando 'translatedStructure'.
    // Exemplo: updateUI(translatedStructure); 
    
    // Nenhuma mensagem será exibida na tela.
    console.log(`Prancha traduzida para o idioma. Renderizando...`);
};


/**
 * Função que carrega o JSON do idioma e traduz a estrutura de dados 'data'.
 * @param {string} lang - O código do idioma ('pt', 'en', 'es').
 */
async function setLanguage(lang) {
    
    if (lang === 'pt') {
        // 1. Se for português, redireciona para a página inicial (index.html)
        // Isso simula um reset da prancha para o idioma padrão.
        localStorage.setItem('userLang', 'pt');
        window.location.href = 'index.html'; 
        return;
    }

    try {
        // 2. Carrega o arquivo de tradução (ex: 'en.json' ou 'es.json')
        const response = await fetch(`./${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`Não foi possível carregar o arquivo ${lang}.json.`);
        }
        
        const translations = await response.json();

        // 3. Cria uma cópia profunda da estrutura original para traduzir
        const translatedStructure = JSON.parse(JSON.stringify(data)); 

        // 4. Percorre todas as páginas/grupos (home, alimentacao, etc.) dentro de 'data'
        for (const pageKey in translatedStructure) {
            if (translatedStructure.hasOwnProperty(pageKey) && Array.isArray(translatedStructure[pageKey])) {
                
                // Mapeia os botões da página atual
                translatedStructure[pageKey] = translatedStructure[pageKey].map(item => {
                    const originalLabel = item.label;
                    const translatedLabel = translations[originalLabel];
                    
                    // Se houver tradução no arquivo JSON, usa. Senão, mantém o original (PT)
                    return {
                        ...item, // Mantém emoji, children, etc.
                        label: translatedLabel || originalLabel // Substitui apenas o 'label'
                    };
                });
            }
        }
        
        // 5. Salva a preferência de idioma e Renderiza a prancha (silenciosamente)
        localStorage.setItem('userLang', lang);
        renderBoard(translatedStructure);

    } catch (error) {
        // Apenas registra o erro no console, sem exibir na tela.
        console.error(`[ERRO DE TRADUÇÃO] Falha ao carregar ou aplicar a tradução para ${lang}.`, error);
    }
}

// Conectando os botões de idioma e carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    // 6. Listener para os botões de idioma (assumindo que eles têm o atributo data-lang)
    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 7. Carregamento inicial (aplica o idioma salvo, SE NÃO FOR PORTUGUÊS)
    const savedLang = localStorage.getItem('userLang');
    
    // Se o idioma salvo for diferente de português, aplica a tradução 
    // (A página index.html é carregada por padrão, se savedLang for 'pt', 
    // o script apenas espera a interação do usuário).
    if (savedLang && savedLang !== 'pt') {
        setLanguage(savedLang); 
    } 
    // Se for 'pt', apenas renderiza a estrutura 'data' original, 
    // pois estamos em index.html.
    else if (savedLang === 'pt' || !savedLang) {
        renderBoard(data);
    }
});
