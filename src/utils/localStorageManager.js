export function getHeroSectionData() {
	if (typeof window === "undefined") return null;
	const data = localStorage.getItem("heroSectionData");
	return data ? JSON.parse(data) : null;
}

export function saveHeroSectionData(newData) {
	if (typeof window === "undefined") return;
	localStorage.setItem("heroSectionData", JSON.stringify(newData));
	window.dispatchEvent(new Event("heroSectionUpdated"));
}

