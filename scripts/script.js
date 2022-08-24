const defaultRef = 'https://google.com/';
const contentContinueBtn = document.querySelector(".content__continue-btn");
const contentPricesElements = [...document.querySelectorAll(".content__prices-item")];

setButtonRef();

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

contentPricesElements.forEach((price) => {
    price.addEventListener("click", () => handlePriceElementClick(price));
})