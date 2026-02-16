import AutoPage from "../pages/AutoPage";
import Page from "../pages/Page";
import TransitionPhasePage from "../pages/TransitionPhasePage";

const mainElement: HTMLElement = document.querySelector("main");

const autoPage = new AutoPage();
const transitionPhasePage = new TransitionPhasePage();

let currentPage: Page = autoPage;

export namespace PageManager {
    export function begin() {
        autoPage.nextButton.addEventListener("click", _ => changePage(transitionPhasePage));

        transitionPhasePage.backButton.addEventListener("click", _ => changePage(autoPage));

        changePage(autoPage);
    }

    function changePage(targetPage: Page) {
        currentPage.domElement.remove();
        currentPage.bottomBar.domElement.remove();
        
        currentPage = targetPage;

        mainElement.appendChild(targetPage.domElement);
        mainElement.appendChild(targetPage.bottomBar.domElement);
    }
}