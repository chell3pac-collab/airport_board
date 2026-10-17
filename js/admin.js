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
    return window.matchMedia('(max-width: 680px)').matches;
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
    let workingData = [];
    let currentType = 'Вылет';
    let searchQuery = '';
    let isEditing = false;

    const tableBody = document.getElementById('flightsBody');
    const table = document.getElementById('flightsTable');
    const board = document.querySelector('.board');
    const searchInput = document.getElementById('searchInput');
    const tabDeparture = document.getElementById('tabDeparture');
    const tabArrival = document.getElementById('tabArrival');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const addForm = document.getElementById('addForm');
    const formError = document.getElementById('formError');

    const addDate = document.getElementById('addDate');
    const addTime = document.getElementById('addTime');
    const addDirection = document.getElementById('addDirection');
    const addFlight = document.getElementById('addFlight');
    const addAirline = document.getElementById('addAirline');
    const addStatus = document.getElementById('addStatus');
    const addType = document.getElementById('addType');

    const STATUS_COLORS = {
        'Отменён': '#DB2525',
        'В полёте': '#005FCB',
        'Посадка': '#005FCB',
        'Задерживается': '#DB2525',
        'Прибыл': '#0B8C00',
        'Регистрация': '#000000'
    };

    const DELETE_ICON_SVG =
        '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="10" cy="10" r="9.54545" stroke="#DB2525" stroke-width="0.909091" />' +
        '<path d="M6.65283 14.1528L14.1528 6.65283" stroke="#DB2525" stroke-width="0.981955" stroke-linecap="round" />' +
        '<path d="M13.8472 14.1528L6.34717 6.65283" stroke="#DB2525" stroke-width="0.981955" stroke-linecap="round" />' +
        '</svg>';

    const SVG_ICON =
        '<svg class="status-select__icon" width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M0.5 0.5L6.5 6.5" stroke="currentColor" stroke-linecap="round" />' +
        '<path d="M12.5 0.5L6.5 6.5" stroke="currentColor" stroke-linecap="round" />' +
        '</svg>';

    function createTableTr(obj) {
        const tr = document.createElement('tr');
        tr.className = 'board__row';
        tr.dataset.id = obj.id;

        const statusClass = STATUS_CLASSES[obj.status] || '';
        const logoPath = getAirlineLogoPath(obj.airline);

        let logoHtml = '';
        if (logoPath) {
            logoHtml = '<img src="' + logoPath + '" alt="' + escapeHtml(obj.airline) + '" class="board__logo-img">';
        } else {
            logoHtml = '<span class="airline-name-fallback">' + escapeHtml(obj.airline) + '</span>';
        }

        let html = '';

        if (isMobile()) {
            let options = '';
            if (isEditing) {
                STATUSES.forEach(function (s) {
                    const selected = s === obj.status ? ' selected' : '';
                    const optClass = STATUS_CLASSES[s] || '';
                    options += '<option value="' + s + '" class="' + optClass + '"' + selected + '>' + s + '</option>';
                });
            }

            const statusSelectHtml = isEditing ?
                '<div class="status-select__wrapper">' +
                '<select class="status-select ' + statusClass + '" data-id="' + obj.id + '">' + options + '</select>' +
                SVG_ICON +
                '</div>' :
                '<span class="mobile-status-badge ' + statusClass + '">' + escapeHtml(obj.status) + '</span>';

            const deleteBtnHtml = isEditing ?
                '<button class="delete-icon" data-id="' + obj.id + '" title="Удалить рейс" aria-label="Удалить рейс">' + DELETE_ICON_SVG + '</button>' : '';

            html =
                '<td colspan="6" class="board__cell board__cell--mobile-card">' +
                '<div class="mobile-card">' +
                '<div class="mobile-card__inner">' +
                '<div class="mobile-card__header">' +
                '<span class="mobile-card__date">' + escapeHtml(obj.date) + '</span>' +
                '<span class="mobile-card__time">' + escapeHtml(obj.time) + '</span>' +
                '</div>' +
                '<div class="mobile-card__direction">' + escapeHtml(obj.direction) + '</div>' +
                '<div class="mobile-card__flight">' + escapeHtml(obj.flightNumber) + '</div>' +
                '</div>' +
                '<div class="mobile-card__actions">' +
                '<span class="mobile-card__status">Статус</span>' +
                '<div class="mobile-card__wrapper">' +
                statusSelectHtml +
                deleteBtnHtml +
                '</div>' +
                '</div>' +
                '</div>' +
                '</td>';
        } else {
            let options = '';
            if (isEditing) {
                STATUSES.forEach(function (s) {
                    const selected = s === obj.status ? ' selected' : '';
                    const optClass = STATUS_CLASSES[s] || '';
                    options += '<option value="' + s + '" class="' + optClass + '"' + selected + '>' + s + '</option>';
                });
            }

            html =
                '<td class="board__cell" data-label="Дата">' + escapeHtml(obj.date) + '</td>' +
                '<td class="board__cell" data-label="Время">' + escapeHtml(obj.time) + '</td>' +
                '<td class="board__cell" data-label="Направление">' + escapeHtml(obj.direction) + '</td>' +
                '<td class="board__cell" data-label="Рейс">' + escapeHtml(obj.flightNumber) + '</td>' +
                '<td class="board__cell board__cell--airline" data-label="Авиакомпания">' +
                logoHtml +
                '</td>';

            if (isEditing) {
                html +=
                    '<td class="board__cell board__cell--status" data-label="Статус">' +
                    '<div class="status-select__wrapper">' +
                    '<select class="status-select ' + statusClass + '" data-id="' + obj.id + '">' + options + '</select>' +
                    SVG_ICON +
                    '</div>' +
                    '</td>' +
                    '<td class="board__cell board__cell--hidden" data-label="Действия">' +
                    '<button class="delete-icon" data-id="' + obj.id + '" title="Удалить рейс" aria-label="Удалить рейс">' +
                    DELETE_ICON_SVG +
                    '</button>' +
                    '</td>';
            } else {
                html += '<td class="board__cell ' + statusClass + '" data-label="Статус">' + escapeHtml(obj.status) + '</td>';
                html += '<td class="board__cell board__cell--hidden" data-label="Действия"></td>';
            }
        }

        tr.innerHTML = html;
        return tr;
    }

    function render(array) {
        tableBody.innerHTML = '';

        if (array.length === 0) {
            const tr = document.createElement('tr');
            tr.className = 'board__row';
            const colspan = isMobile() ? 6 : (isEditing ? 7 : 6);
            tr.innerHTML = '<td class="board__empty" colspan="' + colspan + '">Рейсы не найдены</td>';
            tableBody.appendChild(tr);
            return;
        }

        array.forEach(function (item) {
            tableBody.appendChild(createTableTr(item));
        });

        if (isEditing) {
            attachEditHandlers();
        }
    }

    function attachEditHandlers() {
        const statusSelects = tableBody.querySelectorAll('.status-select');
        statusSelects.forEach(function (select) {
            select.addEventListener('change', function () {
                const id = parseInt(this.dataset.id, 10);
                const newStatus = this.value;
                const newClass = STATUS_CLASSES[newStatus] || '';

                this.className = 'status-select ' + newClass;

                const item = workingData.find(function (f) { return f.id === id; });
                if (item) {
                    item.status = newStatus;
                }
            });
        });

        const deleteIcons = tableBody.querySelectorAll('.delete-icon');
        deleteIcons.forEach(function (icon) {
            icon.addEventListener('click', function () {
                const id = parseInt(this.dataset.id, 10);
                workingData = workingData.filter(function (f) { return f.id !== id; });
                updateView();
            });
        });
    }

    function updateView() {
        const source = isEditing ? workingData : allFlights;

        let filtered = source.filter(function (item) {
            return item.type === currentType;
        });

        if (searchQuery) {
            filtered = filtered.filter(function (item) {
                return item.direction.toLowerCase().indexOf(searchQuery) !== -1;
            });
        }

        render(filtered);
    }

    function toggleEditMode() {
        if (!isEditing) {
            isEditing = true;
            workingData = JSON.parse(JSON.stringify(allFlights));
            editBtn.textContent = 'отменить редактирование';
            table.classList.add('board__table--editing');
            board.classList.add('board--editing');
            updateView();
        } else {
            isEditing = false;
            workingData = [];
            editBtn.textContent = 'Редактирование';
            table.classList.remove('board__table--editing');
            board.classList.remove('board--editing');
            allFlights = getData();
            updateView();
        }
    }

    function saveChanges() {
        if (!isEditing) return;

        allFlights = JSON.parse(JSON.stringify(workingData));
        saveData(allFlights);
        isEditing = false;
        workingData = [];
        editBtn.textContent = 'Редактирование';
        table.classList.remove('board__table--editing');
        board.classList.remove('board--editing');
        updateView();
    }

    function validateForm() {
        const errors = [];

        function markError(input, message) {
            const group = input.closest('.add-form__group');
            if (!group) return;

            const errorMsg = group.querySelector('.form-error-message');
            group.classList.add('has-error');
            if (errorMsg) errorMsg.textContent = message;
            errors.push(message);
        }

        function clearError(input) {
            const group = input.closest('.add-form__group');
            const errorMsg = group && group.querySelector('.form-error-message');
            if (group) group.classList.remove('has-error');
            if (errorMsg) errorMsg.textContent = '';
        }

        [addDate, addTime, addDirection, addFlight, addAirline, addStatus, addType].forEach(clearError);

        let isValid = true;

        if (!addDate.value.trim()) {
            markError(addDate, 'Укажите дату');
            isValid = false;
        }

        if (!addTime.value.trim()) {
            markError(addTime, 'Укажите время');
            isValid = false;
        }

        if (!addDirection.value.trim()) {
            markError(addDirection, 'Укажите направление');
            isValid = false;
        }

        if (!addFlight.value.trim()) {
            markError(addFlight, 'Укажите номер рейса');
            isValid = false;
        }

        if (!addAirline.value) {
            markError(addAirline, 'Выберите авиакомпанию');
            isValid = false;
        }

        if (!addStatus.value) {
            markError(addStatus, 'Выберите статус');
            isValid = false;
        }

        if (!addType.value) {
            markError(addType, 'Выберите тип');
            isValid = false;
        }

        return isValid;
    }

    function updateStatusColor() {
        const value = addStatus.value;
        const color = STATUS_COLORS[value];

        if (color) {
            addStatus.style.color = color;
        } else {
            addStatus.style.color = '';
        }
    }

    function setSelectBlackColor(selectElement) {
        if (selectElement.value) {
            selectElement.style.color = '#000000';
        } else {
            selectElement.style.color = '';
        }
    }


    editBtn.addEventListener('click', toggleEditMode);
    saveBtn.addEventListener('click', saveChanges);

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

    addStatus.addEventListener('change', updateStatusColor);
    addAirline.addEventListener('change', () => setSelectBlackColor(addAirline));
    addType.addEventListener('change', () => setSelectBlackColor(addType));

    if (addTime.tagName === 'SELECT') {
        addTime.addEventListener('change', () => setSelectBlackColor(addTime));
    }
    if (addDirection.tagName === 'SELECT') {
        addDirection.addEventListener('change', () => setSelectBlackColor(addDirection));
    }

    addForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        formError.textContent = '';

        const newFlight = {
            id: generateId(allFlights),
            date: addDate.value.trim(),
            time: addTime.value.trim(),
            direction: addDirection.value.trim(),
            flightNumber: addFlight.value.trim(),
            airline: addAirline.value,
            status: addStatus.value,
            type: addType.value
        };

        allFlights.push(newFlight);
        saveData(allFlights);
        updateView();
        addForm.reset();

        [addAirline, addType, addDate, addTime, addDirection, addFlight, addStatus].forEach(el => {
            if (el) {
                el.style.color = ''; 
            }
        });

        addStatus.style.color = '';

        [addDate, addTime, addDirection, addFlight, addAirline, addStatus, addType]
            .forEach(function (input) {
                const group = input.closest('.add-form__group');
                if (group) group.classList.remove('has-error');
            });
    });

    [addDate, addTime, addDirection, addFlight, addAirline, addStatus, addType].forEach(function (input) {
        input.addEventListener('input', function () {
            const group = this.closest('.add-form__group');
            const errorMsg = group && group.querySelector('.form-error-message');
            if (group) group.classList.remove('has-error');
            if (errorMsg) errorMsg.textContent = '';
        });

        input.addEventListener('change', function () {
            const group = this.closest('.add-form__group');
            const errorMsg = group && group.querySelector('.form-error-message');
            if (group) group.classList.remove('has-error');
            if (errorMsg) errorMsg.textContent = '';
        });
    });

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateView, 150);
    });

    allFlights = getData();
    updateView();
})();




