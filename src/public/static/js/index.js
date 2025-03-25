$(() => {
    let ita_deck = ["1B", "1C", "1D", "1S", "2B", "2C", "2D", "2S", "3B", "3C", "3D", "3S", "4B", "4C", "4D", "4S", "5B", "5C", "5D", "5S", "6B", "6C", "6D", "6S", "7B", "7C", "7D", "7S", "8B", "8C", "8D", "8S", "9B", "9C", "9D", "9S", "10B", "10C", "10D", "10S"];
    let red_fra_deck = [];
    let blue_fra_deck = [];

    $(".card").on("click", function () {
        let chosen = "";
        const type = "";
        const back = "";
        const card = $(this);
        const face = card.attr("data-face");
        const path = "/static/assets/decks";

        if (card.hasClass("ita")) {
            type = "ita";
            back = "/static/assets/decks/back/ita.png";
        } else if (card.hasClass("fra") && card.hasClass("red")) {
            type = "fra/red";
            back = "/static/assets/decks/back/fra/red.png";
        } else if (card.hasClass("fra") && card.hasClass("blue")) {
            type = "fra/blue";
            back = "/static/assets/decks/back/fra/blue.png";
        }

        if (face) {
            if (card.attr("src") !== back) {card.attr("src", back);}
            else {card.attr("src", `${path}/${type}/${face}.png`);}
        } else {
            if (type === "ita" && ita_deck.length > 0) {
                const index = Math.floor(Math.random() * ita_deck.length);
                chosen = ita_deck.splice(index, 1)[0];
            } else if (type === "fra/red" && red_fra_deck.length > 0) {
                index = Math.floor(Math.random() * red_fra_deck.length);
                chosen = red_fra_deck.splice(index, 1)[0];
            } else if (type === "fra/blue" && blue_fra_deck.length > 0) {
                const index = Math.floor(Math.random() * blue_fra_deck.length);
                chosen = blue_fra_deck.splice(index, 1)[0];
            }

            card.attr("data-face", chosen);
            card.attr("src", `${path}/${type}/${chosen}.png`);
        }
    });
});