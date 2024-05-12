export default function currencyToNumber(currencyStr){
    return Number(currencyStr.match(/\d+(?:\.\d{2}|\,\d{2})?/g).join("").replace(",", "."));
}