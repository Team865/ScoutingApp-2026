import AutoPage from "../pages/AutoPage";
import EndgameClimbPage from "../pages/EndgameClimb";
import TeleopShiftsPage from "../pages/TeleopShiftsPage";
import Page from "../pages/Page";
import PreMatchPage from "../pages/PreMatchPage";
import AppData, { scouterNameChanged } from '../AppData';
import ManualInputPage from "../pages/ManualPreMatchPage";
import MatchSelectionPage from "../pages/MatchSelectionPage";
import { getScoutingRotation, ScoutingRotation, uploadScoutingData } from "../util/APIHelper";

const mainElement: HTMLElement = document.querySelector("main");
const titleElement: HTMLHeadingElement = document.querySelector("h1#page-title");

const matchSelectionPage = new MatchSelectionPage("PLACEHOLDER");
const manualInputPage = new ManualInputPage();
const preMatchPage = new PreMatchPage();
const autoPage = new AutoPage();
const teleopShiftsPage = new TeleopShiftsPage();
const endgameClimbPage = new EndgameClimbPage();

let currentPage: Page = autoPage;
let isSubmitting: boolean = false;

async function updateScouterName() {
    const scoutingRotation = await getScoutingRotation();

    matchSelectionPage.header.textContent = "Name: " + AppData.scouter_name;
    matchSelectionPage.updateMatches(scoutingRotation);
}

scouterNameChanged.connect(updateScouterName);

export namespace PageManager {
    export async function begin() {
        updateScouterName();

        matchSelectionPage.header.textContent = `Name: ${AppData.scouter_name}`;
        matchSelectionPage.manualInputButton.addEventListener("click", _ => {
            autoPage.backButton.addEventListener("click", _ => changePage(manualInputPage));
            changePage(manualInputPage);
        });
        matchSelectionPage.matchSelected.connect(alliance => {
            autoPage.backButton.addEventListener("click", _ => changePage(preMatchPage));
            preMatchPage.update(alliance);
            changePage(preMatchPage);
        });

        manualInputPage.goToNextPage.connect(() => {
            if(manualInputPage.readyToContinue()) {
                changePage(autoPage);
                manualInputPage.updateAppData();
            }
        });
        preMatchPage.goToNextPage.connect(() => changePage(autoPage));
;
        autoPage.nextButton.addEventListener("click", _ => changePage(teleopShiftsPage));

        teleopShiftsPage.backButton.addEventListener("click", _ => changePage(autoPage));
        teleopShiftsPage.nextButton.addEventListener("click", _ => changePage(endgameClimbPage));

        endgameClimbPage.backButton.addEventListener("click", _ => changePage(teleopShiftsPage));
        endgameClimbPage.submitButton.addEventListener("click", onSubmit);

        changePage(matchSelectionPage);
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
        if(isSubmitting) return;
        if(!confirm("ARE YOU SURE YOU WANT TO SUBMIT? YOU WILL BE REDIRECTED BACK TO THE MATCH SELECTION PAGE AFTER SUBMISSION")) return;
        isSubmitting = true;

        autoPage.updateAppData();
        teleopShiftsPage.updateAppData();
        endgameClimbPage.updateAppData();

        uploadScoutingData().then(() => window.location.reload());
    }
}