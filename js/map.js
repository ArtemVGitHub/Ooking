'use strict';
// Общие функции
// Получение случайного числа
var getRandomInteger = function (min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
};
// Получение слуйчайного элемента массива
var getRandomArrayElement = function (arr) {
	var randValue = getRandomInteger(0, arr.length - 1);
	return arr[randValue];
};
// Случайное перемешивание в массиве
var arrayShuffle = function (arr) {
	var j, temp, newArr;
	newArr = arr.slice();
	for (var i = newArr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = newArr[j];
		newArr[j] = newArr[i];
		newArr[i] = temp;
	}
	return newArr;
};
//Получение случайного массива случайной длины
var getRandomArray = function (arr) {
	var newArray = arr.slice();
	arrayShuffle(newArray);
	return newArray.slice(0, getRandomInteger(0, arr.length));
};


//Функции проекта

var ADS_COUNT = 8;

// Получение массива аватарок
var ADS_AVATARS = [];
for (var i = 0; i < ADS_COUNT; i++) {
	ADS_AVATARS.push("img/avatars/user0" + (i + 1) + ".png");
	ADS_AVATARS = arrayShuffle(ADS_AVATARS);
}
// Получение массива заголовков
var ADS_TITLES = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
for (var i = 0; i < ADS_COUNT; i++) {
	ADS_TITLES = arrayShuffle(ADS_TITLES);
}
// Получение адреса
var MAP_WIDTH = [0, 1200];
var MAP_HEIGHT = [130, 630];
var adsLocation;
var getLocation = function (width, height) {
	return {
		x: getRandomInteger(width[0], width[1]),
		y: getRandomInteger(height[0], height[1])
	};
}
var ADS_TYPES = ["palace", "flat", "house", "bungalo"];

var CHECK_TIME = ["12:00", "13:00", "14:00"];

var ADS_FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

var ADS_PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

// Получение массива объявлений
var ADS = [];
for (var i = 0; i < ADS_COUNT; i++) {
	adsLocation = getLocation(MAP_WIDTH, MAP_HEIGHT);
	ADS.push({
		"author": {
			"avatar": ADS_AVATARS[i]
		},
		"offer": {
			"title": ADS_TITLES[i],
			"address": `${adsLocation.x}, ${adsLocation.y}`,
			"price": getRandomInteger(1000, 1000000),
			"type": getRandomArrayElement(ADS_TYPES),
			"rooms": getRandomInteger(1, 5),
			"guests": getRandomInteger(1, 50),
			"checkin": getRandomArrayElement(CHECK_TIME),
			"checkout": getRandomArrayElement(CHECK_TIME),
			"features": getRandomArray(ADS_FEATURES),
			"description": "",
			"photos": arrayShuffle(ADS_PHOTOS)
		},
		"location": {
			x: adsLocation.x,
			y: adsLocation.y
		}
	});
}

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

// Генерация маркеров
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderMapPins = function (ad) {

	var pinElement = mapPinTemplate.cloneNode(true);

	pinElement.style.left = ad.location.x + "px";
	pinElement.style.top = ad.location.y + "px";
	pinElement.querySelector('img').src = ad.author.avatar;
	pinElement.querySelector('img').alt = ad.offer.title;

	return pinElement;
};
var mapPinFragment = document.createDocumentFragment();

for (var i = 0; i < ADS.length; i++) {
	mapPinFragment.append(renderMapPins(ADS[i]));
}

var mapPins = document.querySelector('.map__pins');
mapPins.append(mapPinFragment);

// Сопоставления типов Жилья

var translateOfferTypes = function (offerType) {
	switch (offerType) {
		case "flat":
			return "Квартира";
		case "bungalo":
			return "Бунгало";
		case "house":
			return "Дом";
		case "palace":
			return "Дворец";
		default:
			break;
	}
};

// Генерация объявления
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderMapCard = function (card) {

	var cardElement = mapCardTemplate.cloneNode(true);

	cardElement.querySelector('.popup__avatar').src = card.author.avatar;
	cardElement.querySelector('.popup__title').textContent = card.offer.title;
	cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
	cardElement.querySelector('.popup__text--price').textContent = `${card.offer.price} ₽/ночь`;
	cardElement.querySelector('.popup__type').textContent = translateOfferTypes(card.offer.type);
	cardElement.querySelector('.popup__text--capacity').textContent = `${card.offer.rooms} для ${card.offer.guests} гостей`;
	cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}`;
	cardElement.querySelector('.popup__features').innerHTML = "";
	for (var i = 0; i < card.offer.features.length; i++) {
		cardElement.querySelector('.popup__features').insertAdjacentHTML('beforeend', `<li class="feature feature--${card.offer.features[i]}"></li>`);
	}
	cardElement.querySelector('.popup__description').textContent = card.offer.description;
	cardElement.querySelector('.popup__photos').innerHTML = "";
	for (i = 0; i < card.offer.photos.length; i++) {
		cardElement.querySelector('.popup__photos').insertAdjacentHTML('beforeend', `<li><img src="${card.offer.photos[i]}"></li>`);
	}

	return cardElement;
};
var mapCardFragment = document.createDocumentFragment();
mapCardFragment.append(renderMapCard(ADS[0]));
var mapFiltersContainer = mapElement.querySelector('.map__filters-container');
mapFiltersContainer.before(mapCardFragment);

console.log(ADS);