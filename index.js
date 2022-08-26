
import "./styles/normalize.css";
import "./assets/fonts/fonts.css";
import "./styles/style.css";

const defaultRef = 'https://google.com/';
const languageParameterName = 'lang';
const availableLanguages = ['en','es','fr','ja','nl','ru','zh'];
const defaultLanguage = 'en';
const contentContinueBtn = document.querySelector(".content__continue-btn");
const contentPricesElements = [...document.querySelectorAll(".content__prices-item")];

setButtonRef();
checkLanguageParameterFromUrl();

function setButtonRef(priceElement) {
    if (priceElement) {
        contentContinueBtn.setAttribute('href', priceElement.dataset.ref)
    } else {
        contentContinueBtn.setAttribute('href', defaultRef)
    }
}

function handlePriceElementClick(priceElement) {
    const activePriceElement = contentPricesElements.find(priceElement => priceElement.classList.contains("active"));
    if (activePriceElement) {
        activePriceElement.classList.remove('active');
    }

    priceElement.classList.add("active");
    setButtonRef(priceElement);
}

function checkLanguageParameterFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let urlLanguage = params.get(languageParameterName);

    if(!urlLanguage || !availableLanguages.find(lang => lang === urlLanguage)) {
        urlLanguage = getBrowserLanguage();
    }

    if(!availableLanguages.find(lang => lang === urlLanguage)) {
        urlLanguage = defaultLanguage;
    }

    params.set(languageParameterName, urlLanguage);
    var newRelativePathQuery = window.location.pathname + '?' + params.toString();
    history.pushState(null, '', newRelativePathQuery);
}

function getBrowserLanguage() {
    return parseLanguage(window.navigator.language);
}

function parseLanguage(language) {
    return language.split('-')[0];
}

contentPricesElements.forEach((priceElement) => {
    priceElement.addEventListener("click", () => handlePriceElementClick(priceElement));
})