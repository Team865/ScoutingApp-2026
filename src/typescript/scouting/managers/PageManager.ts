import AutoPage from "../pages/AutoPage";
import EndgameClimbPage from "../pages/EndgameClimb";
import EndgamePreClimbPage from "../pages/EndgamePreClimbPage";
import TeleopShiftsPage from "../pages/TeleopShiftsPage";
import Page from "../pages/Page";
import TransitionPhasePage from "../pages/TransitionPhasePage";

const mainElement: HTMLElement = document.querySelector("main");

const autoPage = new AutoPage();
const transitionPhasePage = new TransitionPhasePage();
const teleopShiftsPage = new TeleopShiftsPage();
const endgamePreClimbPage = new EndgamePreClimbPage();
const endgameClimbPage = new EndgameClimbPage();

let currentPage: Page = autoPage;

export namespace PageManager {
    export function begin() {
        autoPage.nextButton.addEventListener("click", _ => changePage(transitionPhasePage));

        transitionPhasePage.backButton.addEventListener("click", _ => changePage(autoPage));
        transitionPhasePage.nextButton.addEventListener("click", _ => changePage(teleopShiftsPage));

        teleopShiftsPage.backButton.addEventListener("click", _ => changePage(transitionPhasePage));
        teleopShiftsPage.nextButton.addEventListener("click", _ => changePage(endgamePreClimbPage));

        endgamePreClimbPage.backButton.addEventListener("click", _ => changePage(teleopShiftsPage));
        endgamePreClimbPage.nextButton.addEventListener("click", _ => changePage(endgameClimbPage));

        endgameClimbPage.backButton.addEventListener("click", _ => changePage(endgamePreClimbPage));

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