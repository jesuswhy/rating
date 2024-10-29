// Ваши ключевые параметры для доступа к таблице
const SHEET_ID = '1J-84v9v1d4s-lKOa8PYq1Ix6EWGkl7HdRGiJ4PhF95g';  // Замените на ваш ID таблицы
const API_KEY = 'AIzaSyDYnae9ehXc1-jhXpoBzTT8BYobwBkQbU8';  // Замените на ваш API ключ

const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Рейтинг покупателей!A3:W?key=${API_KEY}`;

const buyerList = document.getElementById('buyerList');
const modal = document.getElementById('buyerModal');
const closeBtn = document.querySelector('.close-btn');

function openModal(buyerData) {
    document.getElementById('buyerName').textContent = buyerData.name;
    document.getElementById('buyerRating').textContent = buyerData.rating;
    document.getElementById('buyerReputation').textContent = buyerData.reputation;
    document.getElementById('contractSpeed').textContent = buyerData.contractSpeed;
    document.getElementById('supplyCount').textContent = buyerData.supplyCount;
    document.getElementById('paymentSpeed').textContent = buyerData.paymentSpeed;
    document.getElementById('claimsCount').textContent = buyerData.qualityClaims;

    modal.style.display = 'flex';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

async function loadBuyers() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();

        const rows = data.values;
        if (rows && rows.length > 0) {
            rows.some(row => {
                // Прекращаем обработку, если строка пустая
                if (row.length === 0 || row.every(cell => cell === '')) return true;

                // Создаем объект с данными покупателя
                const buyerData = {
                    name: row[1] || 'N/A',               // Имя покупателя
                    rating: row[3] || 'N/A',             // Рейтинг
                    reputation: row[6] || 'N/A',         // Репутация
                    contractSpeed: row[8] || 'N/A',      // Скорость подписания контракта
                    supplyCount: row[16] || 'N/A',       // Количество поставок
                    paymentSpeed: row[18] || 'N/A',      // Скорость оплаты
                    qualityClaims: row[19] || 'N/A'      // Претензии по качеству
                };

                // Создаем элемент списка для покупателя
                const listItem = document.createElement('li');
                listItem.className = 'buyer-item';
                listItem.innerHTML = `
                    <span class="buyer-name">${buyerData.name}</span>
                    <span class="buyer-rating">Рейтинг: ${buyerData.rating}</span>
                `;
                listItem.onclick = () => openModal(buyerData);
                buyerList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

window.onload = loadBuyers;
