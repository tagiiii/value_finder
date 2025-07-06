document.addEventListener('DOMContentLoaded', () => {
    // Materializeのコンポーネントを初期化
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    // DOM要素の取得
    const topScreen = document.getElementById('top-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startButton = document.getElementById('start-button');
    const confirmButton = document.getElementById('confirm-button');
    const finishButton = document.getElementById('finish-button');
    const drawCardButton = document.getElementById('draw-card-button');

    // イベントリスナーの設定
    startButton.addEventListener('click', () => {
        topScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        startGame();
    });

    confirmButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        resultScreen.style.display = 'block';
        renderFinalCards();
    });

    drawCardButton.addEventListener('click', () => {
        if (selectedCard) {
            replaceCard(selectedCard.id);
        }
    });

    finishButton.addEventListener('click', () => {
        const finalCardsArea = document.getElementById('final-cards-area');
        const orderedCardElements = Array.from(finalCardsArea.children); // 現在のDOMの並び順を取得

        const captureContainer = document.createElement('div');
        captureContainer.id = 'capture-container';
        captureContainer.style.cssText = `
            padding: 50px;
            background-color: #ffffff;
            width: 1100px; /* 5枚のカードが横に並ぶように幅を調整 */
            margin: 0 auto;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            font-family: 'M PLUS Rounded 1c', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 12px;
        `;

        captureContainer.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 50px; color: #333; font-size: 38px; font-weight: 700;">あなたの価値観 - 最終結果</h2>
            <div id="captured-cards-display" style="display: flex; justify-content: center; gap: 40px; flex-wrap: nowrap;">
                <!-- カードがここに挿入される -->
            </div>
        `;

        const capturedCardsDisplay = captureContainer.querySelector('#captured-cards-display');

        orderedCardElements.forEach((cardEl, index) => {
            const cardId = parseInt(cardEl.dataset.cardId, 10);
            const card = cardData.find(c => c.id === cardId); // 元のカードデータを検索

            if (card) {
                const newCardElement = document.createElement('div');
                // キャプチャ用のスタイルを直接適用
                newCardElement.style.cssText = `
                    width: 190px;
                    height: 280px;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    padding: 25px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* コンテンツを上下に分散 */
                    align-items: center;
                    position: relative;
                    transition: all 0.3s ease;
                `;
                newCardElement.innerHTML = `
                    <span style="position: absolute; top: 15px; left: 20px; font-size: 28px; font-weight: bold; color: #424242;">${index + 1}</span>
                    <span style="font-size: 26px; font-weight: bold; color: #333; margin-top: 20px;">${card.keyword}</span>
                    <p style="font-size: 15px; color: #666; text-align: center; line-height: 1.5; margin-top: 15px;">${card.description}</p>
                `;
                capturedCardsDisplay.appendChild(newCardElement);
            }
        });

        document.body.appendChild(captureContainer); // 一時的にDOMに追加

        setTimeout(() => {
            html2canvas(captureContainer, {
                scale: 2, // 解像度を2倍にする
                backgroundColor: '#ffffff', // 背景色を白に設定
                useCORS: true // 外部リソースの読み込みを許可
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'value-finder-result.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                document.body.removeChild(captureContainer); // キャプチャ後、DOMから削除
            });
        }, 500); // 新しいコンテナが完全にレンダリングされるまで待機
    });
});

const cardData = [
    { id: 1, keyword: '達成', description: '目標を達成し、成功を収めること。' },
    { id: 2, keyword: '冒険', description: '新しいことに挑戦し、探求すること。' },
    { id: 3, keyword: '権威', description: 'リーダーシップを発揮し、他者に影響を与えること。' },
    { id: 4, keyword: '自律', description: '自分のペースで、独立して物事を進めること。' },
    { id: 5, keyword: '博愛', description: '他者の幸福を願い、助けること。' },
    { id: 6, keyword: '帰属', description: 'グループやコミュニティの一員であると感じること。' },
    { id: 7, keyword: '挑戦', description: '困難な課題に立ち向かい、乗り越えること。' },
    { id: 8, keyword: '変化', description: '多様で、変化に富んだ環境を好むこと。' },
    { id: 9, keyword: '快適', description: '心身ともにリラックスでき、ストレスのない状態。' },
    { id: 10, keyword: '貢献', description: '社会や他者のために役立つこと。' },
    { id: 11, keyword: '創造', description: '新しいアイデアや物を生み出すこと。' },
    { id: 12, keyword: '好奇心', description: '未知の物事に対して、探求心を持つこと。' },
    { id: 13, keyword: '公平', description: 'すべての人や物事を、偏りなく公正に扱うこと。' },
    { id: 14, keyword: '家族', description: '家族との時間を大切にし、深い絆を育むこと。' },
    { id: 15, keyword: '友情', description: '親しい友人との関係を大切にすること。' },
    { id: 16, keyword: '楽しさ', description: 'ユーモアや遊び心を持って、物事を楽しむこと。' },
    { id: 17, keyword: '健康', description: '心身ともに健やかで、エネルギッシュな状態。' },
    { id: 18, keyword: '誠実', description: '正直で、言動に責任を持つこと。' },
    { id: 19, keyword: '知性', description: '深く考え、学び、理解を深めること。' },
    { id: 20, keyword: '愛情', description: '他者と深く愛し、愛される関係を築くこと。' },
    { id: 21, keyword: '忠誠', description: '信頼できる人や組織に対して、誠実であること。' },
    { id: 22, keyword: '熟達', description: '特定の分野で、高いレベルのスキルを身につけること。' },
    { id: 23, keyword: '自然', description: '自然との触れ合いを大切にし、その美しさを感じること。' },
    { id: 24, keyword: '秩序', description: '整理整頓され、安定した環境を好むこと。' },
    { id: 25, keyword: '情熱', description: '何かに夢中になり、エネルギーを注ぐこと。' },
    { id: 26, keyword: '喜び', description: '日々の生活の中に、楽しみや満足感を見出すこと。' },
    { id: 27, keyword: '人気', description: '多くの人から好かれ、認められること。' },
    { id: 28, keyword: '富', description: '経済的に豊かになり、多くの資産を持つこと。' },
    { id: 29, keyword: '安定', description: '変化の少ない、予測可能な環境で安心して過ごすこと。' },
    { id: 30, keyword: '知恵', description: '経験と知識に基づき、的確な判断を下すこと。' }
];

let deck = [];
let hand = [];
let selectedCard = null;
let exchangeCount = 10; // 初期交換回数

function startGame() {
    deck = shuffle([...cardData]); // 元の配列を壊さないようにコピーをシャッフル
    hand = [];
    selectedCard = null;
    exchangeCount = 10; // ゲーム開始時に交換回数をリセット
    drawInitialHand();
    renderHand();
    updateDrawButtonState();
    updateExchangeCountDisplay();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawInitialHand() {
    for (let i = 0; i < 5; i++) {
        if(deck.length > 0) {
            hand.push(deck.pop());
        }
    }
}

function renderHand() {
    const handArea = document.getElementById('hand-area');
    handArea.innerHTML = '';
    hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        if (selectedCard && selectedCard.id === card.id) {
            cardElement.classList.add('selected');
        }
        cardElement.dataset.cardId = card.id;
        cardElement.innerHTML = `
            <span class="card-number">${index + 1}</span>
            <i class="material-icons card-detail-icon">info_outline</i>
            <span class="keyword">${card.keyword}</span>
        `;

        // カード本体のクリック：カード選択
        cardElement.addEventListener('click', (e) => {
            // アイコンクリックの場合は選択イベントを発火させない
            if (e.target.classList.contains('card-detail-icon')) return;
            selectCard(card, cardElement);
        });

        // 詳細アイコンのクリック：詳細表示
        cardElement.querySelector('.card-detail-icon').addEventListener('click', () => {
            showCardDetail(card);
        });

        handArea.appendChild(cardElement);
    });
}

function selectCard(card, element) {
    // すべてのカードの選択状態を解除
    document.querySelectorAll('#hand-area .card').forEach(el => el.classList.remove('selected'));

    // クリックされたカードが、すでに選択されていたカードと同じなら選択を解除
    if (selectedCard && selectedCard.id === card.id) {
        selectedCard = null;
    } else {
        // 別のカードを選択
        selectedCard = card;
        element.classList.add('selected');
    }
    updateDrawButtonState();
}

function updateDrawButtonState() {
    const drawCardButton = document.getElementById('draw-card-button');
    if (selectedCard) {
        drawCardButton.classList.remove('disabled');
    } else {
        drawCardButton.classList.add('disabled');
    }
}

function replaceCard(cardId) {
    const cardIndex = hand.findIndex(card => card.id === cardId);
    if (cardIndex > -1) {
        if (deck.length > 0 && exchangeCount > 0) {
            const newCard = deck.pop();
            const oldCard = hand[cardIndex];
            hand[cardIndex] = newCard;
            deck.unshift(oldCard); // 古いカードは山札の先頭に戻す
            
            exchangeCount--; // 交換回数を減らす
            selectedCard = null; // 選択状態をリセット
            renderHand();
            updateDrawButtonState();
            updateExchangeCountDisplay(); // 表示を更新
        } else if (exchangeCount <= 0) {
            M.toast({html: '交換回数が残っていません。'});
        } else {
            M.toast({html: '山札に交換できるカードがありません。'})
        }
    }
}

function updateExchangeCountDisplay() {
    const exchangeCountSpan = document.querySelector('#exchange-count span');
    const drawCardButton = document.getElementById('draw-card-button');

    exchangeCountSpan.textContent = exchangeCount;

    if (exchangeCount <= 0) {
        drawCardButton.classList.add('disabled');
        M.toast({html: '交換回数がなくなりました。この5枚で決定してください。'});
    }
}

function showCardDetail(card) {
    const modal = document.getElementById('card-detail-modal');
    const content = document.getElementById('card-detail-content');
    content.innerHTML = `
        <h4>${card.keyword}</h4>
        <p>${card.description}</p>
    `;
    const instance = M.Modal.getInstance(modal);
    instance.open();
}

function renderFinalCards() {
    const finalCardsArea = document.getElementById('final-cards-area');
    finalCardsArea.innerHTML = '';
    hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.cardId = card.id;
        cardElement.innerHTML = `
            <span class="card-number">${index + 1}</span>
            <i class="material-icons card-detail-icon">info_outline</i>
            <span class="keyword">${card.keyword}</span>
        `;
        cardElement.querySelector('.card-detail-icon').addEventListener('click', () => {
            showCardDetail(card);
        });
        finalCardsArea.appendChild(cardElement);
    });

    new Sortable(finalCardsArea, {
        animation: 150,
        ghostClass: 'blue-background-class',
        onEnd: function (evt) {
            // 並び替え後にカード番号を更新
            const cards = finalCardsArea.querySelectorAll('.card');
            cards.forEach((cardEl, idx) => {
                cardEl.querySelector('.card-number').textContent = idx + 1;
            });
        }
    });
}