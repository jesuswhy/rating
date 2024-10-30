const SHEET_ID = '1J-84v9v1d4s-lKOa8PYq1Ix6EWGkl7HdRGiJ4PhF95g';  // Замените на ваш ID таблицы
const API_KEY = 'AIzaSyDYnae9ehXc1-jhXpoBzTT8BYobwBkQbU8';  // Замените на ваш API ключ

const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Рейтинг покупателей!A3:W?key=${API_KEY}`;

const buyerList = document.getElementById('buyerList');
const modal = document.getElementById('buyerModal');
const closeBtn = document.querySelector('.close-btn');

// Показать экран загрузки при открытии страницы
document.getElementById('loading').style.display = 'flex';

// Функция для скрытия экрана загрузки
function hideLoadingScreen() {
    document.getElementById('loading').style.display = 'none';
    document.querySelector('header').style.display = 'block'; // Показываем header
}

// Функция открытия модального окна с данными покупателя
function openModal(buyerData) {
    document.getElementById('buyerName').textContent = buyerData.name;
    document.getElementById('buyerSOW').textContent = buyerData.SOW;
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

// Функция загрузки данных и управления анимацией загрузки
function getGroup(buyerData) {
    if (buyerData.rating >= 85) return 'groupA';
    else if (buyerData.rating >= 60) return 'groupB';
    else return 'groupC';
}

async function loadBuyers() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();

        const rows = data.values;
        if (rows && rows.length > 0) {
            for (const row of rows) {
                // Проверяем, является ли строка полностью пустой
                if (row.every(cell => cell === '')) break;

                // Заполняем данные о покупателе, если строка не пустая
                const buyerData = {
                    name: row[1] || 'N/A',
                    SOW: row[2] || 'N/A',
                    rating: parseInt(row[3]) || 0,
                    reputation: row[6] || 'N/A',
                    contractSpeed: row[18] || 'N/A',
                    supplyCount: row[17] || 'N/A',
                    paymentSpeed: row[19] || 'N/A',
                    qualityClaims: row[20] || 'N/A'
                };

                const listItem = document.createElement('li');
                listItem.className = 'buyer-item';
                listItem.innerHTML = `
                    <span class="buyer-name">${buyerData.name}</span>
                    <span class="buyer-rating">Рейтинг: ${buyerData.rating}</span>
                `;
                listItem.onclick = () => openModal(buyerData);

                // Добавляем покупателя в соответствующий список группы
                const group = getGroup(buyerData);
                document.getElementById(group).appendChild(listItem);
            }
        }
        hideLoadingScreen(); // Скрываем экран загрузки после успешной загрузки данных
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        hideLoadingScreen(); // Скрываем экран даже в случае ошибки
    }
}




window.onload = loadBuyers;


// Пример поиска покупателей
document.getElementById('searchBar').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const buyerItems = document.querySelectorAll('.buyer-item');

    buyerItems.forEach(item => {
        const name = item.querySelector('.buyer-name').textContent.toLowerCase();
        item.style.display = name.includes(query) ? '' : 'none';
    });
});

