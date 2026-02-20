import AutoPage from "../pages/AutoPage";
import EndgameClimbPage from "../pages/EndgameClimb";
import EndgamePreClimbPage from "../pages/EndgamePreClimbPage";
import TeleopShiftsPage from "../pages/TeleopShiftsPage";
import Page from "../pages/Page";
import TransitionPhasePage from "../pages/TransitionPhasePage";
import PreMatchPage from "../pages/PreMatchPage";
import AppData from '../AppData';

const mainElement: HTMLElement = document.querySelector("main");
const titleElement: HTMLHeadingElement = document.querySelector("h1#page-title");

const preMatchPage = new PreMatchPage();
const autoPage = new AutoPage();
const transitionPhasePage = new TransitionPhasePage();
const teleopShiftsPage = new TeleopShiftsPage();
const endgamePreClimbPage = new EndgamePreClimbPage();
const endgameClimbPage = new EndgameClimbPage();

let currentPage: Page = autoPage;

export namespace PageManager {
    export function begin() {
        preMatchPage.goToNextPage.connect(() => changePage(autoPage));

        autoPage.backButton.addEventListener("click", _ => changePage(preMatchPage));
        autoPage.nextButton.addEventListener("click", _ => changePage(transitionPhasePage));

        transitionPhasePage.backButton.addEventListener("click", _ => changePage(autoPage));
        transitionPhasePage.nextButton.addEventListener("click", _ => changePage(teleopShiftsPage));

        teleopShiftsPage.backButton.addEventListener("click", _ => changePage(transitionPhasePage));
        teleopShiftsPage.nextButton.addEventListener("click", _ => changePage(endgamePreClimbPage));

        endgamePreClimbPage.backButton.addEventListener("click", _ => changePage(teleopShiftsPage));
        endgamePreClimbPage.nextButton.addEventListener("click", _ => changePage(endgameClimbPage));

        endgameClimbPage.backButton.addEventListener("click", _ => changePage(endgamePreClimbPage));
        endgameClimbPage.submitButton.addEventListener("click", onSubmit);

        changePage(preMatchPage);
    }

    function changePage(targetPage: Page) {
        currentPage.domElement.remove();
        currentPage.bottomBar.domElement.remove();
        
        currentPage = targetPage;

        mainElement.appendChild(targetPage.domElement);
        mainElement.appendChild(targetPage.bottomBar.domElement);

        titleElement.scrollIntoView();
    }

    function onSubmit() {
        autoPage.updateAppData();
        transitionPhasePage.updateAppData();
        teleopShiftsPage.updateAppData();
        endgamePreClimbPage.updateAppData();
        endgameClimbPage.updateAppData();

        console.log(AppData);
    }
}