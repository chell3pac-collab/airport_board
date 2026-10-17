const STORAGE_KEY = 'airportBoardData';

const STATUSES = [
    'Прибыл',
    'Посадка',
    'В полёте',
    'Отменён',
    'Задерживается',
    'Регистрация'
];

const STATUS_CLASSES = {
    'Прибыл': 'board__cell--arrived',
    'Посадка': 'board__cell--boarding',
    'В полёте': 'board__cell--flying',
    'Отменён': 'board__cell--cancelled',
    'Задерживается': 'board__cell--delayed',
    'Регистрация': 'board__cell--registration'
};

const AIRLINE_COLORS = {
    'АЭРОФЛОТ': '#1a3a5c',
    'РОССИЯ': '#d32f2f',
    'Nordwind': '#e67e22',
    'Ural Airlines': '#2e7d32',
    'S7 Airlines': '#8bc34a',
    'Уральские авиалинии': '#2e7d32'
};

const INITIAL_DATA = [
    { id: 1, date: '27 апр.', time: '08:55', direction: 'Москва SVO', flightNumber: 'SU-1651', airline: 'АЭРОФЛОТ', status: 'Прибыл', type: 'Прилёт' },
    { id: 2, date: '27 апр.', time: '09:20', direction: 'Сочи', flightNumber: 'FV-6502', airline: 'РОССИЯ', status: 'Прибыл', type: 'Прилёт' },
    { id: 3, date: '27 апр.', time: '09:30', direction: 'Санкт-Петербург', flightNumber: 'SU-1637', airline: 'АЭРОФЛОТ', status: 'Прибыл', type: 'Прилёт' },
    { id: 4, date: '27 апр.', time: '10:00', direction: 'Москва DME', flightNumber: 'U6-526', airline: 'Уральские авиалинии', status: 'Посадка', type: 'Вылет' },
    { id: 5, date: '27 апр.', time: '10:15', direction: 'Анапа', flightNumber: 'U6-484', airline: 'Уральские авиалинии', status: 'Посадка', type: 'Вылет' },
    { id: 6, date: '27 апр.', time: '10:30', direction: 'Калининград', flightNumber: 'SU-1645', airline: 'АЭРОФЛОТ', status: 'Посадка', type: 'Вылет' },
    { id: 7, date: '27 апр.', time: '11:00', direction: 'Москва DME', flightNumber: 'U6-482', airline: 'Уральские авиалинии', status: 'Отменён', type: 'Вылет' },
    { id: 8, date: '27 апр.', time: '11:30', direction: 'Санкт-Петербург', flightNumber: 'SU-1621', airline: 'АЭРОФЛОТ', status: 'Отменён', type: 'Прилёт' },
    { id: 9, date: '27 апр.', time: '12:00', direction: 'Минеральные Воды', flightNumber: 'FV-6892', airline: 'РОССИЯ', status: 'В полёте', type: 'Вылет' },
    { id: 10, date: '27 апр.', time: '12:30', direction: 'Симферополь', flightNumber: 'N4-124', airline: 'Nordwind', status: 'В полёте', type: 'Прилёт' },
    { id: 11, date: '27 апр.', time: '13:00', direction: 'Екатеринбург', flightNumber: 'U6-615', airline: 'Уральские авиалинии', status: 'Задерживается', type: 'Вылет' },
    { id: 12, date: '27 апр.', time: '13:30', direction: 'Новосибирск', flightNumber: 'S7-2008', airline: 'S7 Airlines', status: 'Задерживается', type: 'Прилёт' },
    { id: 13, date: '27 апр.', time: '14:00', direction: 'Москва SVO', flightNumber: 'U6-44', airline: 'Уральские авиалинии', status: 'Регистрация', type: 'Вылет' },
    { id: 14, date: '27 апр.', time: '14:30', direction: 'Сочи', flightNumber: 'U6-34', airline: 'Уральские авиалинии', status: 'Регистрация', type: 'Прилёт' },
    { id: 15, date: '27 апр.', time: '15:10', direction: 'Екатеринбург', flightNumber: 'SU-231', airline: 'АЭРОФЛОТ', status: 'Регистрация', type: 'Вылет' },
    { id: 16, date: '27 апр.', time: '15:40', direction: 'Калининград', flightNumber: 'FV-105', airline: 'РОССИЯ', status: 'Посадка', type: 'Прилёт' },
    { id: 17, date: '27 апр.', time: '16:05', direction: 'Санкт-Петербург', flightNumber: 'U6-722', airline: 'Уральские авиалинии', status: 'В полёте', type: 'Вылет' },
    { id: 18, date: '27 апр.', time: '16:30', direction: 'Новосибирск', flightNumber: 'SU-881', airline: 'АЭРОФЛОТ', status: 'Задерживается', type: 'Прилёт' },
    { id: 19, date: '27 апр.', time: '17:00', direction: 'Анапа', flightNumber: 'FV-210', airline: 'РОССИЯ', status: 'Регистрация', type: 'Прилёт' },
    { id: 20, date: '27 апр.', time: '17:25', direction: 'Москва SVO', flightNumber: 'S7-115', airline: 'S7 Airlines', status: 'Посадка', type: 'Вылет' },
    { id: 21, date: '27 апр.', time: '18:00', direction: 'Симферополь', flightNumber: 'U6-901', airline: 'Уральские авиалинии', status: 'Отменён', type: 'Вылет' },
    { id: 22, date: '28 апр.', time: '07:50', direction: 'Минеральные Воды', flightNumber: 'SU-402', airline: 'АЭРОФЛОТ', status: 'Регистрация', type: 'Вылет' },
    { id: 23, date: '28 апр.', time: '08:20', direction: 'Сочи', flightNumber: 'N4-220', airline: 'Nordwind', status: 'В полёте', type: 'Прилёт' },
    { id: 24, date: '28 апр.', time: '08:45', direction: 'Москва DME', flightNumber: 'FV-311', airline: 'РОССИЯ', status: 'Посадка', type: 'Вылет' },
    { id: 25, date: '28 апр.', time: '09:15', direction: 'Санкт-Петербург', flightNumber: 'U6-102', airline: 'Уральские авиалинии', status: 'Задерживается', type: 'Вылет' },
    { id: 26, date: '28 апр.', time: '09:45', direction: 'Екатеринбург', flightNumber: 'SU-553', airline: 'АЭРОФЛОТ', status: 'В полёте', type: 'Прилёт' },
    { id: 27, date: '28 апр.', time: '10:10', direction: 'Новосибирск', flightNumber: 'FV-404', airline: 'РОССИЯ', status: 'Регистрация', type: 'Прилёт' },
    { id: 28, date: '28 апр.', time: '10:40', direction: 'Калининград', flightNumber: 'U6-209', airline: 'Уральские авиалинии', status: 'Посадка', type: 'Вылет' },
    { id: 29, date: '28 апр.', time: '11:10', direction: 'Москва SVO', flightNumber: 'S7-330', airline: 'S7 Airlines', status: 'Отменён', type: 'Прилёт' }
];



function getData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
        saveData(INITIAL_DATA);
        return [...INITIAL_DATA];
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Ошибка чтения localStorage:', e);
        return [...INITIAL_DATA];
    }
}

function saveData(array) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
}

function getAirlineInitials(airline) {
    if (!airline) return '??';
    const words = airline.split(' ');
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return airline.substring(0, 2).toUpperCase();
}

function getAirlineColor(airline) {
    return AIRLINE_COLORS[airline] || '#666';
}

function generateId(array) {
    if (array.length === 0) return 1;
    return Math.max(...array.map(item => item.id)) + 1;
}
