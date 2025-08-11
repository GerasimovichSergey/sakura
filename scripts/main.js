const timerSection = document.querySelector('.cta');

// Burger menu

const burgerBtn = document.querySelector('.burger-btn');
const headerNav = document.querySelector('.header__nav');
const headerMenu = document.querySelector('.header__menu');

const burgerMenuOnOff = () => {
    burgerBtn.classList.toggle('burger_active');
    headerNav.classList.toggle('header__nav_active');
    document.body.classList.toggle('no-scroll');
};

burgerBtn.addEventListener('click', burgerMenuOnOff);

headerMenu.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' && headerNav.classList.contains('header__nav_active')) {
        burgerMenuOnOff();
    }
});

// New Year timer

const getNewYearTime = () => {
    if (!timerSection) {
        return;
    }

    const dateNewYear = '2024-12-31T23:59:59.999Z'
    const dateToday = Date.now();
    const newYearMilliseconds = Date.parse(dateNewYear);
    const newYearThrough = newYearMilliseconds - dateToday;

    if (newYearThrough <= 0) {
        clearInterval(timerId);
        setNewYearTime(0, 0, 0, 0);
        return;
    }

    const daysNewYear = Math.trunc(newYearThrough / 1000 / 60 / 60 / 24);
    const hoursNewYear = Math.trunc((newYearThrough / 1000 / 60 / 60) % 24);
    const minNewYear = Math.trunc((newYearThrough / 1000 / 60) % 60);
    const secNewYear = Math.trunc((newYearThrough / 1000) % 60);

    setNewYearTime(daysNewYear, hoursNewYear, minNewYear, secNewYear);
};

const setNewYearTime = (days, hours, min, sec) => {
    const timerItemDays = document.querySelector('.timer__item-days');
    timerItemDays.innerText = days;

    const timerItemHours = document.querySelector('.timer__item-hours');
    timerItemHours.innerText = hours;

    const timerItemMin = document.querySelector('.timer__item-min');
    timerItemMin.innerText = min;

    const timerItemSec = document.querySelector('.timer__item-sec');
    timerItemSec.innerText = sec;
}

const timerId = setInterval(getNewYearTime, 1000);

// Best Gifts random cards

const giftsPath = 'data/gifts.json';

const getGiftsData = async (path) => {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Произошла ошибка: ${error}`);
        throw error;
    }
};

const getRandomNumber = (arrLength) => {
    return Math.floor(Math.random() * arrLength);
}

const cardsList = document.querySelector('.cards__list');

const createCard = (category, name) => {
    const getCategory = category.split(' ')[1].toLowerCase();

    const card = document.createElement('li');
    card.classList.add('cards__list-item');
    card.dataset.gift = name;

    const cardItem = document.createElement('div');
    cardItem.classList.add('cards__item');

    card.append(cardItem);

    const cardImgContainer = document.createElement('div');
    cardImgContainer.classList.add('card__img-container');
    cardItem.append(cardImgContainer);
    const cardImg = document.createElement('img');
    cardImg.classList.add('card__img');
    cardImg.src = `img/gift-for-${getCategory}.png`;
    cardImg.alt = `Image category`;

    cardImgContainer.append(cardImg);

    const cardTitleContainer = document.createElement('div');
    cardTitleContainer.classList.add('card__title-container');
    cardItem.append(cardTitleContainer);
    const cardCategory = document.createElement('h4');
    cardCategory.classList.add('card__category', `for-${getCategory}`);
    cardCategory.textContent = `For ${getCategory}`;
    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card__title');
    cardTitle.textContent = name;

    cardTitleContainer.append(cardCategory, cardTitle);

    return card;
}

const renderRandomCards = async () => {
    if (!timerSection) {
        return;
    }

    const cardsArr = await getGiftsData(giftsPath);
    const randomGifts = [];

    for (let i = 0; i < 4; i++) {
        const arrI = getRandomNumber(cardsArr.length);
        const giftData = cardsArr[arrI];

        const card = createCard(giftData.category, giftData.name);
        randomGifts.push(card);
    }

    cardsList.append(...randomGifts);
};

renderRandomCards()

// Category switching

const tabsList = document.querySelector('.tabs-list');

if (!timerSection) {
    tabsList.addEventListener('click', (event) => {
        const target = event.target.closest('li');

        if (target) {
            const category = event.target.dataset.category;
            changeCardsCategory(target);
            filterCardsCategory(category);
        }
    });
}

const changeCardsCategory = (targetElem) => {
    const elems = document.querySelectorAll('.tabs-list__item');
    elems.forEach((li) => {
        li.classList.remove('active-tab');
    });
    targetElem.classList.add('active-tab');
}

const filterCardsCategory = async (category = 'All') => {
    const allCardsData = await getGiftsData(giftsPath);

    if (category === 'All') {
        renderCards(allCardsData);
    } else {
        const cardsCategoryArr = allCardsData.filter((card) => {
            if (card.category === `For ${category}`) {
                return card;
            }
        });

        renderCards(cardsCategoryArr);
    }
};

if (!timerSection) {
    filterCardsCategory();
}

const renderCards = async (arr) => {
    if (timerSection) {
        return;
    }

    cardsList.innerHTML = '';

    const cards = arr.map((card) => {
        return createCard(card.category, card.name);
    });

    cardsList.append(...cards);
};

// Scroll to top button

const scrollToTopBtn = document.querySelector('.scroll-to-top-btn');

if (!timerSection) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 300) {
            scrollToTopBtn.classList.add('active-top-btn');
        } else {
            scrollToTopBtn.classList.remove('active-top-btn');
        }
    });
}

// Modal Gifts window

const modalWindow = document.querySelector('.modal-window');
const modalWindowList = document.querySelector('.modal-window__list');

const closeModal = (event) => {
    if (event.target === modalWindow || event.target.closest('.modal-window__close-btn')) {
        modalWindow.classList.remove('modal-window_active');
        document.body.classList.toggle('no-scroll');
        modalWindowList.innerHTML = '';
    }
};

modalWindow.addEventListener('click', closeModal);

cardsList.addEventListener('click', async (event) => {
    const target = event.target.closest('li');

    if (target) {
        modalWindow.classList.add('modal-window_active');
        document.body.classList.toggle('no-scroll');

        const giftsDataArr = await getGiftsData(giftsPath);
        const giftName = target.dataset.gift;

        const giftData = giftsDataArr.find((gift) => gift.name === giftName);
        const giftCard = createCard(giftData.category, giftData.name);

        const giftCardDescription = document.createElement('p');
        giftCardDescription.classList.add('card__description');
        giftCardDescription.innerText = giftData.description;

        const cardTitleContainer = giftCard.querySelector('.card__title-container');

        cardTitleContainer.append(giftCardDescription);

        const superPowersWrapper = document.createElement('div');
        superPowersWrapper.classList.add('superpowers__wrapper');

        const superPowersTitle = document.createElement('h4');
        superPowersTitle.classList.add('card__category');
        superPowersTitle.textContent = 'Adds superpowers to:';

        superPowersWrapper.append(superPowersTitle);

        const superPowersList = document.createElement('ul');
        superPowersList.classList.add('superpowers__list');

        superPowersWrapper.append(superPowersList);

        for (let powerName in giftData.superpowers) {
            const superPowersItem = document.createElement('li');
            superPowersItem.classList.add('superpowers-list-item');

            const superPowerItemContainer = document.createElement('div');
            superPowerItemContainer.classList.add('superpowers-list-item__container');

            superPowersItem.append(superPowerItemContainer);

            const superPowerItemTitle = document.createElement('span');
            superPowerItemTitle.classList.add('superpower-item__title');
            superPowerItemTitle.textContent = powerName;

            superPowerItemContainer.append(superPowerItemTitle);

            const superPowerItemPoints = document.createElement('span');
            superPowerItemPoints.classList.add('superpower-item__points');
            superPowerItemPoints.textContent = giftData.superpowers[powerName];

            superPowerItemContainer.append(superPowerItemPoints);

            const superPowerItemRating = document.createElement('div');
            superPowerItemRating.classList.add('superpower-item__rating');

            superPowerItemContainer.append(superPowerItemRating);

            const icon = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                    <g clip-path="url(#a)">
                        <path d="m12.196 9.882-.548-.317 1.468-.393-.243-.905-2.372.636-1.12-.646a1.408 1.408 0 0 0 0-.514l1.12-.646 2.372.636.243-.905-1.468-.393.548-.317 2.35-.14.346-1.957-1.867-.679-1.298 1.965-.547.316.393-1.468-.905-.242-.636 2.373-1.12.646a1.405 1.405 0 0 0-.444-.257V5.383l1.737-1.737-.662-.663-1.075 1.075v-.633l1.05-2.1L8 0 6.482 1.326l1.05 2.1v.632L6.456 2.983l-.663.663 1.737 1.737v1.292a1.405 1.405 0 0 0-.444.257l-1.12-.646-.635-2.373-.905.243.393 1.467-.548-.316-1.297-1.965-1.868.679.346 1.956 2.35.141.548.317-1.467.393.242.905L5.5 7.097l1.12.646a1.408 1.408 0 0 0 0 .514l-1.12.646-2.373-.636-.242.905 1.467.393-.547.317-2.35.14-.347 1.957 1.868.679 1.297-1.965.548-.316-.393 1.467.905.243.636-2.373 1.12-.646c.13.11.28.199.443.257v1.292l-1.737 1.737.663.663 1.074-1.075v.633l-1.05 2.1L8 16l1.518-1.326-1.05-2.1v-.632l1.075 1.075.662-.663-1.737-1.737V9.325c.165-.058.315-.146.444-.257l1.12.646.636 2.373.905-.242-.393-1.468.547.316 1.298 1.965 1.867-.679-.346-1.956-2.35-.141Z"/>
                    </g>
                    <defs>
                        <clipPath id="a"><path d="M0 0h16v16H0z"/></clipPath>
                    </defs></svg>
            `

            for (let i = 0; i < 5; i++) {
                const getRating = parseInt(giftData.superpowers[powerName]) / 100;

                const superpowerItemIcon = document.createElement('div');
                superpowerItemIcon.className = i < getRating ? 'superpower-item__icon filled' : 'superpower-item__icon';
                superpowerItemIcon.innerHTML = icon;

                superPowerItemRating.append(superpowerItemIcon);
            }

            superPowersList.append(superPowersItem);
        }

        cardTitleContainer.append(superPowersWrapper);
        modalWindowList.append(giftCard);
    }
});

// Slider

const sliderList = document.querySelector('.slider-list');
const sliderBtnRight = document.querySelector('.slider__btn-right');
const sliderBtnLeft = document.querySelector('.slider__btn-left');

if (sliderList) {
    const fullWidthSlider = sliderList.scrollWidth;
    const visibleWidthSlider = sliderList.offsetWidth;

    const initSlider = () => {
        let offset = 0;
        let steps = 0;
        let maxSteps = document.documentElement.clientWidth > 768 ? 3 : 6;

        const maxOffset = fullWidthSlider - visibleWidthSlider;
        const offsetStep = maxOffset / maxSteps;

        sliderBtnRight.addEventListener('click', () => {
            steps++;
            sliderBtnRight.disabled = steps === maxSteps;
            sliderBtnLeft.disabled = steps === 0 ? true : false;
            offset = offset - offsetStep;

            sliderList.style.transform = `translateX(${offset}px)`;
        });

        sliderBtnLeft.addEventListener('click', () => {
            steps--;
            sliderBtnRight.disabled = steps > maxSteps;
            sliderBtnLeft.disabled = steps === 0 ? true : false;
            offset = offset + offsetStep;

            sliderList.style.transform = `translateX(${offset}px)`;
        });
    };

    initSlider();

    window.addEventListener('resize', () => {
        initSlider();
        sliderList.style.transform = 'translateX(0)';
        sliderBtnRight.disabled = false;
        sliderBtnLeft.disabled = true;
    })
}