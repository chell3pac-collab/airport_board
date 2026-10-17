const AIRLINE_LOGOS = {
    'аэрофлот': 'aeroflot.png',
    'россия': 'rossiya.png',
    'уральские авиалинии': 'ural.png',
    's7 airlines': 's7.png',
    'nordavia': 'nordavia.png',
    'азимут': 'azimut.png',
    'nordwind': 'nordavia.png',
    'ural airlines': 'ural.png'
};

function getAirlineLogoPath(airlineName) {
    const name = (airlineName || '').trim().toLowerCase();
    const fileName = AIRLINE_LOGOS[name];

    if (fileName) {
        return 'images/' + fileName;
    }
    return '';
}

function isMobile() {
    return window.matchMedia('(max-width: 600px)').matches;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


(function () {
    'use strict';

    let allFlights = [];
    let currentType = 'Вылет';
    let searchQuery = '';

    const tableBody = document.getElementById('flightsBody');
    const searchInput = document.getElementById('searchInput');
    const tabDeparture = document.getElementById('tabDeparture');
    const tabArrival = document.getElementById('tabArrival');

    function createTableTr(obj) {
        const tr = document.createElement('tr');
        tr.className = 'board__row';
        tr.dataset.id = obj.id;

        const statusClass = STATUS_CLASSES[obj.status] || '';
        const logoPath = getAirlineLogoPath(obj.airline);

        if (isMobile()) {
            let logoHtml = '';
            if (logoPath) {
                logoHtml = '<span class="table__airline">' +
                    '<img src="' + logoPath + '" alt="' + escapeHtml(obj.airline) + '" class="airline-logo__img">' +
                    '</span>';
            }

            tr.innerHTML =
                '<td class="table__cell table__cell--info">' +
                    '<div class="table__cell-wrapper">' +  
                    '<span class="table__date">' + escapeHtml(obj.date) + '</span>' +
                    '<span class="table__time">' + escapeHtml(obj.time) + '</span>' +
                    '</div>' +
                    '<span class="table__direction">' + escapeHtml(obj.direction) + '</span>' +
                    '<span class="table__flight">' + escapeHtml(obj.flightNumber) + '</span>' +              
                '</td>' +
                '<td class="table__cell table__cell--status ' + statusClass + '">' +
                    '<span class="table__status-label">Статус</span>' +
                    '<span class="table__status-value">' + escapeHtml(obj.status) + '</span>' +
                '</td>';
        } else {
            let logoHtml = '';
            if (logoPath) {
                logoHtml = '<img src="' + logoPath + '" alt="' + obj.airline + '" class="board__logo-img">';
            } else {
                logoHtml = '<span class="airline-name-fallback">' + obj.airline + '</span>';
            }

            tr.innerHTML =
                '<td class="board__cell board__cell--user" data-label="Дата">' + obj.date + '</td>' +
                '<td class="board__cell" data-label="Время">' + obj.time + '</td>' +
                '<td class="board__cell" data-label="Направление">' + obj.direction + '</td>' +
                '<td class="board__cell" data-label="Рейс">' + obj.flightNumber + '</td>' +
                '<td class="board__cell board__cell--airline" data-label="Авиакомпания">' +
                    logoHtml +
                '</td>' +
                '<td class="board__cell ' + statusClass + '" data-label="Статус">' + obj.status + '</td>';
        }

        return tr;
    }

    function render(array) {
        tableBody.innerHTML = '';

        if (array.length === 0) {
            const tr = document.createElement('tr');
            tr.className = 'board__row';
            tr.innerHTML = '<td class="board__empty" colspan="2">Рейсы не найдены</td>';
            tableBody.appendChild(tr);
            return;
        }

        array.forEach(function (item) {
            tableBody.appendChild(createTableTr(item));
        });
    }

    function updateView() {
        let filtered = allFlights.filter(function (item) {
            return item.type === currentType;
        });

        if (searchQuery) {
            filtered = filtered.filter(function (item) {
                return item.direction.toLowerCase().indexOf(searchQuery) !== -1;
            });
        }

        render(filtered);
    }

    function setActiveTab(activeTab, inactiveTab) {
        activeTab.classList.add('board__tab--active');
        activeTab.setAttribute('aria-selected', 'true');
        inactiveTab.classList.remove('board__tab--active');
        inactiveTab.setAttribute('aria-selected', 'false');
    }

    tabDeparture.addEventListener('click', function () {
        currentType = 'Вылет';
        setActiveTab(tabDeparture, tabArrival);
        updateView();
    });

    tabArrival.addEventListener('click', function () {
        currentType = 'Прилёт';
        setActiveTab(tabArrival, tabDeparture);
        updateView();
    });

    searchInput.addEventListener('keyup', function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        updateView();
    });

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateView, 150);
    });

    allFlights = getData();
    updateView();
})();

