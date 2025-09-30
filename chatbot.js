// Função principal do chat
async function perguntar() {
    const input = document.getElementById("pergunta");
    const pergunta = input.value.trim();
    if (!pergunta) return;

    // Adiciona pergunta do usuário
    adicionarMensagem("Você", pergunta);
    input.value = "";

    // Mostra balão "digitando"
    const resposta = document.getElementById("resposta");
    const typing = document.createElement("div");
    typing.classList.add("mensagem", "digitando");
    typing.innerHTML = 'Bot está digitando <span></span><span></span><span></span>';
    resposta.appendChild(typing);
    resposta.scrollTop = resposta.scrollHeight;

    try {
        const apiKey = "AIzaSyBVQqq7fFc-bH0JeD0lY-KK50Wk6di6qSE"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const body = { contents: [{ parts: [{ text: pergunta }] }] };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        const textoBot = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";

        // Remove balão digitando e adiciona a resposta limpa
        typing.remove();
        adicionarMensagem("Bot", textoBot);

    } catch (err) {
        typing.remove();
        adicionarMensagem("Bot", "Erro: " + err);
    }
}

// Função para limpar texto de markdown e símbolos indesejados
function limparTexto(texto) {
    return texto
        .replace(/[*#]/g, "")     // remove * e #
        .replace(/\/\/+/g, "")    // remove //
        .replace(/\n{2,}/g, "\n") // remove linhas extras
        .trim();
}

// Função para adicionar mensagens no chat
function adicionarMensagem(remetente, texto) {
    const resposta = document.getElementById("resposta");
    const msg = document.createElement("div");
    msg.classList.add("mensagem", remetente === "Você" ? "mensagem-usuario" : "mensagem-bot");

    // Limpa markdown e mantém quebras de linha
    msg.innerHTML = limparTexto(texto).replace(/\n/g, "<br>");
    
    resposta.appendChild(msg);
    resposta.scrollTop = resposta.scrollHeight; // rola para a última mensagem
}

// Função para mostrar/esconder animação de carregamento
function mostrarCarregamento(show) {
    let loading = document.getElementById("loading");
    
    if (!loading) {
        loading = document.createElement("div");
        loading.id = "loading";
        loading.classList.add("loading");
        loading.textContent = "Carregando...";
        document.querySelector(".card").insertBefore(loading, document.getElementById("resposta"));
    }

    loading.style.display = show ? "flex" : "none";
}

const input = document.getElementById("pergunta");

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {   
        event.preventDefault();     
        perguntar();                
    }
});