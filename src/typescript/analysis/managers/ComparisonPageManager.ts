import ComparisonPage from "../components/ComparisonPage";

const mainElement = document.querySelector("main");
const title = document.querySelector("main > h1") as HTMLHeadingElement;
const filterBar = document.querySelector("div#filter-bar");
const filterMenu = document.querySelector("div#filter-menu");
const teamList = document.querySelector("div#main-content");

const comparisonPage = new ComparisonPage();
const openComparisonButton = document.querySelector("button#go-to-comparison") as HTMLButtonElement;

export namespace ComparisonPageManager {
    export function start() {
        openComparisonButton.addEventListener("click", _ => {
            mainElement.replaceChildren(title, comparisonPage.domElement);
        });

        comparisonPage.exitButton.addEventListener("click", _ => {
            mainElement.replaceChildren(title, filterBar, filterMenu, teamList);
        });
    }
}