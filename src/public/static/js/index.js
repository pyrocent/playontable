$(() => {
    let ita_deck = ["e/e9/01_Asso_di_denari.jpg/800px-01_Asso_di_denari"];
    let red_fra_deck = [];
    let blue_fra_deck = [];

    $(".card").on("click", function () {
        let type = "";
        let back = "";
        let chosen = "";
        const card = $(this);
        const face = card.attr("data-face");

        if (card.hasClass("ita")) {
            type = "ita";
            back = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Carte_Napoletane_retro.jpg/800px-Carte_Napoletane_retro.jpg";
        } else if (card.hasClass("fra") && card.hasClass("blue")) {
            type = "fra/blue";
            back = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Carta_Francese_retro_Blu.jpg/800px-Carta_Francese_retro_Blu.jpg";
        }
        else if (card.hasClass("fra") && card.hasClass("red")) {
            type = "fra/red";
            back = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Carta_Francese_retro_Rosso.jpg/800px-Carta_Francese_retro_Rosso.jpg";
        }

        if (face) {
            if (card.attr("src") !== back) {
                card.attr("src", back);
            } else {
                if (type === "ita") {
                    card.attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Carte_Napoletane_retro.jpg/800px-Carte_Napoletane_retro.jpg");
                } else if (type === "fra/blue") {
                    card.attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Carta_Francese_retro_Blu.jpg/800px-Carta_Francese_retro_Blu.jpg");
                } else if (type === "fra/red") {
                    card.attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Carta_Francese_retro_Rosso.jpg/800px-Carta_Francese_retro_Rosso.jpg");
                }
            }
        } else {
            if (type === "ita" && ita_deck.length > 0) {
                const index = Math.floor(Math.random() * ita_deck.length);
                chosen = ita_deck.splice(index, 1)[0];
            } else if (type === "fra/blue" && blue_fra_deck.length > 0) {
                const index = Math.floor(Math.random() * blue_fra_deck.length);
                chosen = blue_fra_deck.splice(index, 1)[0];
            } else if (type === "fra/red" && red_fra_deck.length > 0) {
                index = Math.floor(Math.random() * red_fra_deck.length);
                chosen = red_fra_deck.splice(index, 1)[0];
            }

            card.attr("data-face", chosen);
            card.attr("src", `https://upload.wikimedia.org/wikipedia/commons/thumb/${chosen}.jpg`);
        }
    });
});