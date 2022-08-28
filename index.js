import "./styles/normalize.css";
import "./assets/fonts/fonts.css";
import "./styles/style.css";

const defaultRef = 'https://google.com/';
const languageParameterName = 'lang';
const availableLanguages = ['en', 'es', 'fr', 'ja', 'nl', 'ru', 'zh'];
const defaultLanguage = 'en';
const contentContinueBtn = document.querySelector(".content__continue-btn");
const contentPricesElements = [...document.querySelectorAll(".content__prices-item")];

contentPricesElements.forEach((priceElement) => {
    priceElement.addEventListener("click", () => handlePriceElementClick(priceElement));
});

window.addEventListener("resize",()=>{
    const language = window.navigator.language.split('-')[0];
    if (!(language === 'ru' || language === 'es' || language === 'fr' || language === 'nl')){
        const decreasedFontDocument = document.documentElement.classList.contains("decrease-size");
        if(decreasedFontDocument){
            document.documentElement.classList.remove("decrease-size")
        }

        // if(!window.innerHeight < 736 && (language === 'fr' || language === 'ru') ){
        //     const decreasedContentFeatures = document.querySelector(".content__features").classList.contains("decrease-features-margin");
        //     if(decreasedContentFeatures){
        //         document.querySelector(".content__features").classList.remove("decrease-features-margin");
        //     }
        // }

    }
    
})

initPage();

async function initPage() {
    setButtonRef();
    const currentLanguage = getLanguageParameterFromUrl();
    const pageContent = await loadContent(currentLanguage);
    insertPageContent(await pageContent.json())
}

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
        element.innerHTML = element.innerHTML.replace('{{price}}/', `${Math.floor((containerCost / 12).toFixed(3) * 100) / 100} `);
    }
    if (containerOfElement.classList.contains("content__prices-item--monthly")) {
        element.innerHTML = element.innerHTML.replace('{{price}}/', `${containerCost} `);
    }
}

function scaleContent(language){
    if (language === 'ru' || language === 'es' || language === 'fr' || language === 'nl') {
        const contentFeatures = document.querySelector(".content__features");
        document.documentElement.classList.add('decrease-size');
        if (window.innerHeight < 736 && (language === 'fr' || language === 'ru')){
            contentFeatures.classList.add("decrease-features-margin");
        }

    }
}

async function loadContent(language) {
    scaleContent(language);
    return await fetch(`./assets/languages/${language}.json`);
}

function insertPageContent(pageContent) {
    const variableElements = document.querySelectorAll(".content__features-item");
    const TextElements = document.querySelectorAll("[data-variable]");
    for (let element of TextElements) {
        const attrVariable = element.dataset.variable;
        element.innerHTML = pageContent[attrVariable];
        if (pageContent.hasOwnProperty(attrVariable)) {
            if (element.hasAttribute("data-price")) {
                element.innerHTML = (element.innerHTML.indexOf('{{price}}')) ? element.innerHTML.replace('{{price}}', `${element.dataset.price} `) : element.innerHTML.replace('{{price}}/', `${element.dataset.price} `);
            }
            if (element.hasAttribute("data-calc")) {
                setPrice(element)
            }

        }

    }
}