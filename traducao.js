// 🚨 Importante: Certifique-se de que a sua variável 'data'
// esteja definida e acessível globalmente (ou passada para esta função).
// Exemplo de como o 'data' deve estar estruturado:
/*
const data = {
    home: [
        {label:'Teclado', emoji: '...'},
        // ...
    ],
    alimentacao: [
        {label:'sal', emoji: '...'},
        // ...
    ],
    // ...outras páginas...
};
*/

/**
 * Função que carrega o JSON do idioma e traduz a estrutura de dados 'data'.
 * @param {string} lang - O código do idioma ('pt', 'en', 'es').
 */
async function setLanguage(lang) {
    
    // ⚠️ ATENÇÃO: Esta é a função que você precisa ter pronta.
    // Ela deve pegar o objeto completo da prancha traduzida e desenhar os botões na tela.
    const renderBoard = (translatedStructure) => {
        // console.log(`Renderizando prancha no idioma: ${lang}`);
        // console.log("Primeiro item traduzido:", translatedStructure.home[0].label); 
        
        // 🚨 SUBSTITUA esta linha pela sua função real de renderização da prancha!
        // Exemplo: updateUI(translatedStructure); 
        alert(`Prancha pronta para renderizar em ${lang}. 
Verifique o console para ver o primeiro botão traduzido (se o JSON foi carregado).`);
    };


    if (lang === 'pt') {
        // 1. Se for português, usa a estrutura ORIGINAL (data)
        renderBoard(data);
        localStorage.setItem('userLang', 'pt');
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
        // Isso evita modificar o objeto 'data' original
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
        
        // 5. Salva a preferência de idioma e Renderiza a prancha com a nova estrutura traduzida
        localStorage.setItem('userLang', lang);
        renderBoard(translatedStructure);

    } catch (error) {
        console.error(`[ERRO DE TRADUÇÃO] Falha ao carregar ou aplicar a tradução para ${lang}.`, error);
        alert('Erro ao carregar a tradução. Por favor, verifique se os arquivos JSON existem.');
    }
}

// Conectando os botões de idioma e carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
    // 6. Listener para os botões de idioma
    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // 7. Carregamento inicial (Mantém o último idioma usado ou inicia em PT)
    const savedLang = localStorage.getItem('userLang') || 'pt';
    setLanguage(savedLang); 
});