import "./styles/normalize.css";
import "./styles/style.css";
import "./styles/fonts/fonts.css";

const languageParameterName = 'lang';
const availableLanguages = ['en', 'es', 'fr', 'ja', 'nl', 'ru', 'zh'];
const defaultLanguage = 'en';
const contentContinueBtn = document.querySelector(".content__continue-btn");
const contentPricesElements = [...document.querySelectorAll(".content__prices-item")];
const descreaseMarginClassName = "decrease-features-margin";

contentPricesElements.forEach((priceElement) => {
    priceElement.addEventListener("click", () => handlePriceElementClick(priceElement));
});

initPage();

window.addEventListener("resize", () => {
    scaleContent(document.documentElement.getAttribute(languageParameterName));
})

async function initPage() {
    setButtonRef();
    const currentLanguage = getLanguageParameterFromUrl();
    const pageContent = await loadContent(currentLanguage);
    insertPageContent(await pageContent.json())
}

function setButtonRef(priceElement) {
    if (priceElement) {
        contentContinueBtn.setAttribute('href', priceElement.dataset.ref);
    } else {
        const activePriceElement = contentPricesElements.find(priceElement => priceElement.classList.contains("active"));
        contentContinueBtn.setAttribute('href', activePriceElement.dataset.ref);
    }
}

function handlePriceElementClick(priceElement) {
    const activePriceElement = contentPricesElements.find(priceElement => priceElement.classList.contains("active"));
    if (activePriceElement) {
        activePriceElement.classList.remove('active');
    }
    setButtonRef(priceElement);
    priceElement.classList.add("active");

}

function getLanguageParameterFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let urlLanguage = params.get(languageParameterName);

    if (!urlLanguage || !availableLanguages.find(lang => lang === urlLanguage)) {
        urlLanguage = getBrowserLanguage();
    }

    if (!availableLanguages.find(lang => lang === urlLanguage)) {
        urlLanguage = defaultLanguage;
    }

    params.set(languageParameterName, urlLanguage);
    var newRelativePathQuery = window.location.pathname + '?' + params.toString();
    document.documentElement.setAttribute("lang", urlLanguage);
    history.pushState(null, '', newRelativePathQuery);

    return urlLanguage;
}

function getBrowserLanguage() {
    return parseLanguage(window.navigator.language);
}

function parseLanguage(language) {
    return language.split('-')[0];
}

function setPrice(element) {
    const containerOfElement = element.parentNode;
    const containerCost = Number(containerOfElement.querySelector(".content__prices-cost").dataset.price.substring(1));
    if (containerOfElement.classList.contains("content__prices-item--annually")) {
        element.innerHTML = element.innerHTML.replace('{{price}}/', `$${Math.floor((containerCost / 12).toFixed(3) * 100) / 100} `);
        console.log(element.innerHTML)
    }
    if (containerOfElement.classList.contains("content__prices-item--monthly")) {
        element.innerHTML = element.innerHTML.replace('{{price}}/', `$${containerCost} `);
    }
}

function scaleContent(language) {
    const contentFeatures = document.querySelector(".content__features");
    if (window.innerHeight < 736 && (language === 'fr' || language === 'ru')) {
        contentFeatures.classList.add(descreaseMarginClassName);
    } else if (contentFeatures.classList.contains(descreaseMarginClassName)) {
        contentFeatures.classList.remove(descreaseMarginClassName);
    }
}

async function loadContent(language) {
    scaleContent(language);
    return await fetch(`./assets/languages/${language}.json`);
}

function insertPageContent(pageContent) {
    const TextElements = document.querySelectorAll("[data-variable]");
    for (let element of TextElements) {
        // console.log(element.hasAttribute("data-calc"))
        const attrVariable = element.dataset.variable;
        element.innerHTML = pageContent[attrVariable];
        if (pageContent.hasOwnProperty(attrVariable)) {
            if (element.hasAttribute("data-price") && !element.hasAttribute("data-calc")) {
                element.innerHTML = (element.innerHTML.indexOf('{{price}}')) ? element.innerHTML.replace('{{price}}', `${element.dataset.price} `) : element.innerHTML.replace('{{price}}/', `${element.dataset.price} `);
            }
           

        }
        if(element.hasAttribute("data-calc")){
            setPrice(element);
        }

    }
}