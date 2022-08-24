const contentContinueBtn = document.querySelector(".content__continue-btn");
const contentPricesElements = [...document.querySelectorAll(".content__prices-item")];


function handlePriceElementClick(priceElement) {
    const activePriceElement = contentPricesElements.find(priceElement => priceElement.classList.contains("active"));
    if (activePriceElement) {
        activePriceElement.classList.remove('active');
    }

    priceElement.classList.add("active");
}

contentPricesElements.forEach((price) => {
    price.addEventListener("click", () => handlePriceElementClick(price));
})