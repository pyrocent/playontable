// Importa PIXI.js da CDN Skypack per compatibilità ESM
import { Application, Sprite, Container, Graphics, Text, TextStyle, Texture, Assets } from 'https://cdn.skypack.dev/pixi.js@8';

export class PixiGameRenderer {
    constructor(container) {
        // Crea l'applicazione PIXI v8
        this.app = new Application();
        this.container = container;
        this.isReady = false;

        // Storage per sprites e textures
        this.sprites = new Map();
        this.textures = new Map();
        
        // Contatore per ID univoci
        this.spriteCounter = 0;

        // L'inizializzazione sarà chiamata esplicitamente con await
    }

    async init() {
        // Inizializza PIXI v8
        await this.app.init({
            width: this.container.clientWidth,
            height: this.container.clientHeight,
            backgroundColor: 0x007649,
            resizeTo: this.container,
            antialias: true
        });

        // Aggiunge il canvas al container
        this.container.appendChild(this.app.canvas);

        // Configura eventi PIXI v8
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;

        // Containers per organizzare gli elementi
        this.gameElements = new Container();
        this.gameElements.sortableChildren = true; // Abilita zIndex
        this.app.stage.addChild(this.gameElements);

        // Crea il bordo del tavolo
        this.createTableBorder();
        
        // Precarica le textures
        await this.loadTextures();
        this.createInitialElements();
        
        this.isReady = true;
        return this;
    }

    createTableBorder() {
        // Crea un bordo decorativo intorno al tavolo
        const border = new Graphics();
        border.lineStyle(10, 0xEF9E57); // Colore arancione del bordo
        border.drawRoundedRect(5, 5, this.app.screen.width - 10, this.app.screen.height - 10, 5);
        this.app.stage.addChild(border);
    }

    async loadTextures() {
        // URL delle textures degli elementi del gioco
        const textureUrls = {
            // Carte italiane
            'ita_back': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/decks/back/ita-v16M4k51oPsbykjlDkP2QC12a2ZlC9.png',
            
            // Carte francesi
            'fra_blue_back': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/decks/back/fra/blue-QGgTJ0hBDa3mmldXMJOAh4qGWzcWJd.png',
            'fra_red_back': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/decks/back/fra/red-0Wy1fwzHybNsgqCW99k7WtZ998hOjv.png',

            // Chips
            'dealer_chip': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chips/dealer-sYeBC4uyggOcM7G0VBKXeBWqik0Bbx.png',
            'gold_chip': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chips/gold-mK38DKE1jkdVUpnvNfGmXL5oI5AmbY.png',
            'blue_chip': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chips/blue-nELR8PhYMbCR6VXot9TGPcRMsQd3Gl.png',
            'red_chip': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chips/red-pxyXd0YqyeXwCCVIMK31QGUP3aDwce.png',
            'green_chip': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chips/green-nMenP6cWx56JHsP2nOtQgRr9EiGsE0.png',

            // Scacchiera
            'chess_board': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/board-XyAXb8E4UnHnqm1yf4KwGGDiJpuIll.png',

            // Pezzi scacchi bianchi
            'white_king': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/white/king-Ux5Uj12u4SHruD854ZHGwjEYikNQBu.png',
            'white_queen': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/white/queen-7m4BGBK75x2Hu9WcR4xNtxLsqI5E1k.png',
            'white_bishop': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/white/bishop-dwyOsemT9jmnTgS1DVhj2SQJNMuDbK.png',
            'white_knight': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/white/knight-ReZ4fnYLkKxygrkdReF3fLwOmKUsxI.png',
            'white_rook': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/white/rook-c3MiKF3VgbniN2qekqe9tt4OXTgRF7.png',
            'white_pawn': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/white/pawn-GmFlnXmT3RPiDwvrLT7euzO6lNsLoE.png',

            // Pezzi scacchi neri
            'black_king': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/black/king-dJACXDezmsSDOqhyT8byCxuPNHZG62.png',
            'black_queen': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/black/queen-Ob9HYYFEIOF8Qfchy7Wzu1XSmwMUqD.png',
            'black_bishop': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/black/bishop-YznTHwR2q0sSSJDkLvotDt3EwOYWn8.png',
            'black_knight': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/black/knight-wUm5i6SH8IbYHOV7UPFFxaFhP2qIvm.png',
            'black_rook': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/black/rook-Mc05r37CaybiKfs1h79q9Fs6slPidu.png',
            'black_pawn': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/chess/black/pawn-bekmNbhp0ZUsXQMVnLlhjaXJlHDTHz.png',

            // Pedine dama
            'white_dama': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dama/white-UQYVzdS0Dk3DxMDcqTRO0Aef4MYZDe.png',
            'black_dama': 'https://gwu0gmqhaw3wrynk.public.blob.vercel-storage.com/dama/black-vzaqbhQalHgEsBVCp2Kidk7YKFRaZk.png'
        };

        // Carica tutte le textures usando PIXI v8 Assets
        const promises = Object.entries(textureUrls).map(async ([key, url]) => {
            try {
                const texture = await Assets.load(url);
                this.textures.set(key, texture);
            } catch (error) {
                console.error(`Errore caricamento texture ${key}:`, error);
            }
        });

        await Promise.all(promises);
    }

    createInitialElements() {
        // Crea tutti gli elementi iniziali del gioco basati sulla struttura HTML esistente

        // Carte italiane (40 carte)
        for (let i = 0; i < 40; i++) {
            this.createCard('ita', 'ita_back', i * 0.5, 20, {
                type: 'card',
                deck: 'ita',
                classes: ['ita', 'card']
            });
        }

        // Carte francesi blu (con jolly)
        for (let i = 0; i < 54; i++) {
            this.createCard('fra_blue', 'fra_blue_back', 40 + i * 0.5, 20, {
                type: 'card',
                deck: 'fra_blue',
                classes: ['blue', 'fra', 'card']
            });
        }

        // Carte francesi blu (senza jolly)
        for (let i = 0; i < 52; i++) {
            this.createCard('fra_blue_no_jolly', 'fra_blue_back', 40 + i * 0.5, 63, {
                type: 'card',
                deck: 'fra_blue_no_jolly',
                classes: ['blue', 'fra', 'card', 'no-jolly']
            });
        }

        // Carte francesi rosse (con jolly)
        for (let i = 0; i < 54; i++) {
            this.createCard('fra_red', 'fra_red_back', 80 + i * 0.5, 20, {
                type: 'card',
                deck: 'fra_red',
                classes: ['red', 'fra', 'card']
            });
        }

        // Carte francesi rosse (senza jolly)
        for (let i = 0; i < 52; i++) {
            this.createCard('fra_red_no_jolly', 'fra_red_back', 80 + i * 0.5, 63, {
                type: 'card',
                deck: 'fra_red_no_jolly',
                classes: ['red', 'fra', 'card', 'no-jolly']
            });
        }

        // Chips
        this.createChip('dealer', 'dealer_chip', 120, 20);
        this.createChip('gold', 'gold_chip', 120, 45, true);
        this.createChip('blue', 'blue_chip', 120, 85, true);
        this.createChip('red', 'red_chip', 120, 125, true);
        this.createChip('green', 'green_chip', 120, 165, true);

        // Scacchiera
        this.createGamePiece('chess_board', 160, 20, 275, 275, {
            type: 'board',
            id: 'board'
        });

        // Pezzi degli scacchi bianchi
        this.createChessPiece('white_king', 440, 20);
        this.createChessPiece('white_queen', 440, 39);
        this.createChessPiece('white_bishop', 440, 76);
        this.createChessPiece('white_bishop', 440, 76);
        this.createChessPiece('white_knight', 440, 113);
        this.createChessPiece('white_knight', 440, 113);
        this.createChessPiece('white_rook', 440, 150);
        this.createChessPiece('white_rook', 440, 150);

        // Pedoni bianchi
        for (let i = 0; i < 10; i++) {
            this.createChessPiece('white_pawn', 440, 187);
        }

        // Pezzi degli scacchi neri
        this.createChessPiece('black_king', 480, 20);
        this.createChessPiece('black_queen', 480, 39);
        this.createChessPiece('black_bishop', 480, 76);
        this.createChessPiece('black_bishop', 480, 76);
        this.createChessPiece('black_knight', 480, 113);
        this.createChessPiece('black_knight', 480, 113);
        this.createChessPiece('black_rook', 480, 150);
        this.createChessPiece('black_rook', 480, 150);

        // Pedoni neri
        for (let i = 0; i < 10; i++) {
            this.createChessPiece('black_pawn', 480, 187);
        }

        // Pedine dama bianche
        for (let i = 0; i < 12; i++) {
            this.createDamaPiece('white_dama', 445, 230);
        }

        // Pedine dama nere
        for (let i = 0; i < 12; i++) {
            this.createDamaPiece('black_dama', 483, 230);
        }
    }

    createCard(id, textureKey, x, y, metadata = {}) {
        const texture = this.textures.get(textureKey);
        if (!texture) return null;

        const sprite = new Sprite(texture);
        sprite.x = x;
        sprite.y = y;
        sprite.width = 37; // Dimensione card basata su CSS esistente
        sprite.height = 50;
        
        // Aggiunge metadati per identificazione
        sprite.gameData = {
            id: `${id}_${this.spriteCounter++}`,
            ...metadata
        };

        this.gameElements.addChild(sprite);
        this.sprites.set(sprite.gameData.id, sprite);
        this.makeInteractive(sprite);

        return sprite;
    }

    createChip(type, textureKey, x, y, isClone = false) {
        const texture = this.textures.get(textureKey);
        if (!texture) return null;

        const sprite = new Sprite(texture);
        sprite.x = x;
        sprite.y = y;
        sprite.width = 35;
        sprite.height = 35;
        
        sprite.gameData = {
            id: `${type}_chip_${this.spriteCounter++}`,
            type: 'chip',
            classes: [type, 'chip', isClone ? 'clone' : ''].filter(Boolean)
        };

        this.gameElements.addChild(sprite);
        this.sprites.set(sprite.gameData.id, sprite);
        this.makeInteractive(sprite);

        return sprite;
    }

    createChessPiece(textureKey, x, y) {
        const texture = this.textures.get(textureKey);
        if (!texture) return null;

        const sprite = new Sprite(texture);
        sprite.x = x;
        sprite.y = y;
        sprite.width = 35;
        sprite.height = 35;
        
        const [color, piece] = textureKey.split('_');
        sprite.gameData = {
            id: `${textureKey}_${this.spriteCounter++}`,
            type: 'chess',
            classes: [color, 'chess', piece]
        };

        this.gameElements.addChild(sprite);
        this.sprites.set(sprite.gameData.id, sprite);
        this.makeInteractive(sprite);

        return sprite;
    }

    createDamaPiece(textureKey, x, y) {
        const texture = this.textures.get(textureKey);
        if (!texture) return null;

        const sprite = new Sprite(texture);
        sprite.x = x;
        sprite.y = y;
        sprite.width = 30;
        sprite.height = 30;
        
        const [color] = textureKey.split('_');
        sprite.gameData = {
            id: `${textureKey}_${this.spriteCounter++}`,
            type: 'dama',
            classes: [color, 'dama']
        };

        this.gameElements.addChild(sprite);
        this.sprites.set(sprite.gameData.id, sprite);
        this.makeInteractive(sprite);

        return sprite;
    }

    createGamePiece(textureKey, x, y, width, height, metadata = {}) {
        const texture = this.textures.get(textureKey);
        if (!texture) return null;

        const sprite = new Sprite(texture);
        sprite.x = x;
        sprite.y = y;
        sprite.width = width;
        sprite.height = height;
        
        sprite.gameData = {
            id: `${textureKey}_${this.spriteCounter++}`,
            ...metadata
        };

        this.gameElements.addChild(sprite);
        this.sprites.set(sprite.gameData.id, sprite);

        return sprite;
    }

    makeInteractive(sprite) {
        sprite.eventMode = 'static'; // PIXI v8 API
        sprite.cursor = 'pointer';
        
        // Variabili per il drag
        sprite.isDragging = false;
        sprite.startPosition = { x: 0, y: 0 };
        
        // Gestione hover
        sprite.on('pointerover', () => {
            if (!sprite.isDragging) {
                sprite.tint = 0xCCCCCC;
            }
        });
        
        sprite.on('pointerout', () => {
            if (!sprite.isDragging) {
                sprite.tint = 0xFFFFFF;
            }
        });

        // Gestione drag and drop
        sprite.on('pointerdown', (event) => {
            sprite.isDragging = true;
            sprite.startPosition = { x: sprite.x, y: sprite.y };
            sprite.zIndex = 1000; // Porta in primo piano
            sprite.alpha = 0.8; // Trasparenza durante il drag
            
            // Stop event propagation
            event.stopPropagation();
            this.app.stage.on('pointermove', this.onDragMove.bind(this, sprite));
        });

        sprite.on('pointerup', () => {
            this.onDragEnd(sprite);
        });

        sprite.on('pointerupoutside', () => {
            this.onDragEnd(sprite);
        });
    }

    onDragMove(sprite, event) {
        if (sprite.isDragging) {
            const position = event.data.global;
            sprite.x = position.x;
            sprite.y = position.y;
        }
    }

    onDragEnd(sprite) {
        if (sprite.isDragging) {
            sprite.isDragging = false;
            sprite.alpha = 1.0;
            sprite.tint = 0xFFFFFF;
            sprite.zIndex = 0;
            
            // Remove global move listener
            this.app.stage.off('pointermove');
            
            // Emit drag event per compatibilità con il sistema esistente
            if (window.room) {
                const index = this.getSpriteIndex(sprite);
                window.room.send('drag', {
                    index: index,
                    x: sprite.x,
                    y: sprite.y,
                    z: sprite.zIndex
                });
            }
        }
    }

    // Metodi per gestire elementi dinamici (da room.js)
    addChip(src, alt, classes) {
        // Determina il tipo di chip dalla classe
        let type = 'gold';
        if (classes.includes('blue')) type = 'blue';
        else if (classes.includes('red')) type = 'red';
        else if (classes.includes('green')) type = 'green';
        else if (classes.includes('dealer')) type = 'dealer';

        const textureKey = `${type}_chip`;
        return this.createChip(type, textureKey, 50, 50, false);
    }

    updateSpritePosition(spriteId, x, y, z) {
        const sprite = this.sprites.get(spriteId);
        if (sprite) {
            sprite.x = x;
            sprite.y = y;
            sprite.zIndex = z;
        }
    }

    showHandBorder(spriteId, isHand) {
        const sprite = this.sprites.get(spriteId);
        if (sprite) {
            if (isHand) {
                // Crea un bordo rosso intorno allo sprite
                const border = new Graphics();
                border.lineStyle(2, 0xFF0000);
                border.drawRect(-2, -2, sprite.width + 4, sprite.height + 4);
                sprite.addChild(border);
                sprite.handBorder = border;
            } else if (sprite.handBorder) {
                sprite.removeChild(sprite.handBorder);
                sprite.handBorder = null;
            }
        }
    }

    hideSprite(spriteId, hide) {
        const sprite = this.sprites.get(spriteId);
        if (sprite) {
            sprite.visible = !hide;
        }
    }

    // Metodo per ottenere l'indice di uno sprite (per compatibilità con il sistema esistente)
    getSpriteIndex(sprite) {
        const children = this.gameElements.children;
        return children.indexOf(sprite);
    }

    // Gestione resize
    resize() {
        if (this.app && this.app.renderer) {
            this.app.renderer.resize(
                this.container.clientWidth, 
                this.container.clientHeight
            );
        }
    }

    // Cleanup
    destroy() {
        this.app.destroy(true, true);
    }
}