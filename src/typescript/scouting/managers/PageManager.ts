import StartingShiftPrompt from "../components/StartingShiftPrompt";
import AutoPage from "../pages/AutoPage";
import EndgameClimbPage from "../pages/EndgameClimb";
import EndgamePreClimbPage from "../pages/EndgamePreClimbPage";
import OffShiftPage from "../pages/OffShiftPage";
import OnShiftPage from "../pages/OnShiftPage";
import Page from "../pages/Page";
import TransitionPhasePage from "../pages/TransitionPhasePage";

const mainElement: HTMLElement = document.querySelector("main");

const autoPage = new AutoPage();
const transitionPhasePage = new TransitionPhasePage();
const shiftPages: Page[] = [];
const endgamePreClimbPage = new EndgamePreClimbPage();
const endgameClimbPage = new EndgameClimbPage();

const startingShiftPrompt = new StartingShiftPrompt();

const numShifts = 6; // Number of shifts (including both on- and off-shifts)

let currentPage: Page = autoPage;

export namespace PageManager {
    export function begin() {
        autoPage.nextButton.addEventListener("click", _ => changePage(transitionPhasePage));

        transitionPhasePage.backButton.addEventListener("click", _ => changePage(autoPage));
        transitionPhasePage.nextButton.addEventListener("click", _ => goToFirstShift());

        startingShiftPrompt.allianceConfirmed.connect(generateShifts);

        endgamePreClimbPage.backButton.addEventListener("click", _ => changePage(shiftPages.at(numShifts - 1)));
        endgamePreClimbPage.nextButton.addEventListener("click", _ => changePage(endgameClimbPage));

        endgameClimbPage.backButton.addEventListener("click", _ => changePage(endgamePreClimbPage));

        changePage(autoPage);
    }

    function generateShifts(isOnAllianceAtStart: boolean) {
        let isOnAlliance = isOnAllianceAtStart;

        for(let i = 0; i < numShifts; i++) {
            const page = isOnAlliance ? new OnShiftPage() : new OffShiftPage();
            shiftPages.push(page);

            // Bind back button
            if(i == 0) {
                page.backButton.addEventListener("click", _ => changePage(transitionPhasePage));
            } else {
                page.backButton.addEventListener("click", _ => changePage(shiftPages.at(i - 1)))
            }

            // Bind next button
            if(i + 1 < numShifts) {
                page.nextButton.addEventListener("click", _ => changePage(shiftPages.at(i + 1)));
                isOnAlliance = !isOnAlliance; // Flip mode
            } else {
                page.nextButton.addEventListener("click", _ => changePage(endgamePreClimbPage));
            }
        }

        goToFirstShift();
    }

    function goToFirstShift() {
        // Create shifts
        if(shiftPages.length == 0) {
            startingShiftPrompt.show();
        } else {
            changePage(shiftPages.at(0));
        }
    }

    function changePage(targetPage: Page) {
        currentPage.domElement.remove();
        currentPage.bottomBar.domElement.remove();
        
        currentPage = targetPage;

        mainElement.appendChild(targetPage.domElement);
        mainElement.appendChild(targetPage.bottomBar.domElement);
    }
}