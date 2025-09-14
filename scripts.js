//variáveis de estado do jogo

let flippedCards = []; //arrey para armazenar as cartas viradas (sempre terá no máximo 2 cartas)
let matchedCards = 0; //contador de pares encontrados
let attempts = 0; //contador de tentativas
let isChekingPair = false; //flag para evitar que o jogador vire mais de 2 cartas ao mesmo tempo

//arrey com todas as cartas do jogo
const cardsItems = [
    { id: 1, content: "🤖", matched: false},
    { id: 2, content: "🤖", matched: false},
    { id: 3, content: "🐎", matched: false},
    { id: 4, content: "🐎", matched: false},
    { id: 5, content: "🤡", matched: false},
    { id: 6, content: "🤡", matched: false},
    { id: 7, content: "🚀", matched: false},
    { id: 8, content: "🚀", matched: false},
    { id: 9, content: "🌎", matched: false},
    { id: 10, content: "🌎", matched: false},
    { id: 11, content: "🎯", matched: false},
    { id: 12, content: "🎯", matched: false},
    { id: 13, content: "⚽️", matched: false},
    { id: 14, content: "⚽️", matched: false},
    { id: 15, content: "🍔", matched: false},
    { id: 16, content: "🍔", matched: false}
]


//função para embaralhar as cartas
function shuffleCards(array) {
    //embaralha as cartas
    const shuffled = array.sort(() => Math.random() - 0.5); //positivo vai depois, negativo vai antes
    return shuffled;
}

function createCard(card) {
    const cardElement = document.createElement("div");   //cria o elemento principal da carta
    cardElement.className = "card"; //adiciona a classe "card" ao elemento
    
    const emoji = document.createElement("span"); //cria o elemento que vai conter o emoji
    emoji.className = "card-emoji"; //adiciona a classe "emoji" ao elemento
    emoji.textContent = card.content; //adiciona o emoji ao elemento

    cardElement.appendChild(emoji); //adiciona o emoji ao elemento principal da carta

    cardElement.addEventListener("click", () => handleCardClick(cardElement, card)); //adiciona o evento de clique à carta

    return cardElement;
}

function renderCards() {
    const deck = document.getElementById("deck");
    deck.innerHTML = ""; //limpa o deck antes de renderizar as cartas

    const cards = shuffleCards(cardsItems);
    cards.forEach((item) => {
        const cardElement = createCard(item);
        deck.appendChild(cardElement);
    })

}

function handleCardClick(cardElement, card) {
    if (
        isChekingPair || //se estiver verificando um par, bloqueia o clique
        cardElement.classList.contains("revealed") //ignora o clique se a carta já estiver revelada 
    ) {
        return
    }

    //revela a carta clicada   
    cardElement.classList.add("revealed");

    //adiciona no arrey de cartas viradas
    flippedCards.push({ cardElement, card });

    //se houver 2 cartas viradas, verifica se são iguais
    if (flippedCards.length === 2) {
        isChekingPair = true; //bloqueia o clique em outras cartas
        attempts++; //incrementa o contador de tentativas

        const [firstCard, secondCard] = flippedCards; //desestrutura o arrey de cartas viradas

        //se as cartas forem iguais
        if (firstCard.card.content === secondCard.card.content) {
            matchedCards++; //incrementa o contador de pares encontrados
            flippedCards = []; //limpa o arrey de cartas viradas
            isChekingPair = false; //libera o clique em outras cartas

            //se todos os pares forem encontrados, exibe uma mensagem de vitória
            if (matchedCards === cardsItems.length / 2) {
                setTimeout(() => {
                    alert(`Parabéns! Você venceu o jogo em ${attempts} tentativas!`);
                    //reinicia o jogo
                    flippedCards = [];
                    matchedCards = 0;
                    attempts = 0;
                    isChekingPair = false;
                    renderCards();
                    updateStats();
                }, 500);
            }
        } else {
            //se as cartas forem diferentes, vira as cartas de volta após 1 segundo
            setTimeout(() => {
                firstCard.cardElement.classList.remove("revealed");
                secondCard.cardElement.classList.remove("revealed");
                flippedCards = []; //limpa o arrey de cartas viradas
                isChekingPair = false; //libera o clique em outras cartas
            }, 1000);
        }
        updateStats(); //atualiza os stats do jogo
    }
}

function updateStats() {
    const stats = document.querySelector(".stats");
    stats.textContent = `${matchedCards} acertos de ${attempts} tentativas`;
}

function resetGame() {
    renderCards();
    document.queryElementById("restart").addEventListener("click", resetGame);
}

renderCards();
// Cria e adiciona o botão "Reiniciar Jogo" apenas uma vez
let restartBtn = document.getElementById("restart");
if (!restartBtn) {
    restartBtn = document.createElement("button");
    restartBtn.id = "restart";
    restartBtn.textContent = "Reiniciar Jogo";
    document.getElementById("deck").parentNode.appendChild(restartBtn);
}

// Função para resetar o jogo
function resetGame() {
    flippedCards = [];
    matchedCards = 0;
    attempts = 0;
    isChekingPair = false;
    renderCards();
    updateStats();
}

restartBtn.onclick = resetGame;
updateStats();
