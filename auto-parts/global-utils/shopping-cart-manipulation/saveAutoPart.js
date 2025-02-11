export default function saveAutoPart(autoPart) {
	localStorage.setItem(autoPart.id + "ap", JSON.stringify(autoPart));
}