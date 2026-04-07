import { bindAccordionBehavior } from "../../../../lib/components/Accordion";
import { ClimbHeight, ScoutingData } from "../../../../scouting/AppData";
import AppData from "../../../AppData";
import HTMLStringBuilder, { Element } from "../../../util/HTMLBuilder";
import SubpageInterface from "./SubpageInterface";

class MatchAccordion {
    public readonly domElement = document.createElement("div");
    private readonly toggleButton = document.createElement("button");
    private readonly accordionBody = document.createElement("div");
    private readonly bodyText = document.createElement("div");

    constructor(matchData: ScoutingData) {
        const matchNumberLabel = document.createElement("h1");
        matchNumberLabel.innerText = `Match ${matchData.match_number}`;

        if(/red/i.test(matchData.robot_position.toString())) {
            this.toggleButton.classList.add("red");
        } else {
            this.toggleButton.classList.add("blue");
        }

        this.toggleButton.addEventListener("click", _ => this.toggle());
        this.accordionBody.appendChild(this.bodyText);

        bindAccordionBehavior(this.domElement, this.accordionBody);

        this.toggleButton.appendChild(matchNumberLabel);
        this.domElement.append(this.toggleButton, this.accordionBody);

        // Displaying data
        const html = new HTMLStringBuilder()
            .append("OVERALL", Element.H1)
            .append(`Comments: ${matchData.comments || "None"}`)
            .append(`Starting Position: ${matchData.robot_position}`)
            .append(`Total Fuel Scored: ${matchData.auto_fuel_scored + matchData.teleop_fuel_scored}`)
            .append(`Driver Skill: ${matchData.driver_skill}`)
            .append(`Defense Skill: ${matchData.teleop_defense || matchData.defense_skill > 0 ? matchData.defense_skill : "N/A"}`)

            .append("AUTONOMOUS", Element.H1)
            .append(`Fuel Scored: ${matchData.auto_fuel_scored}`)
            .append("Intake:")
            .append(`- Depot: ${MatchAccordion.getSymbol(matchData.auto_intake.depot)}`)
            .append(`- Neutral Zone: ${MatchAccordion.getSymbol(matchData.auto_intake.neutral_zone)}`)
            .append(`- Human Player: ${MatchAccordion.getSymbol(matchData.auto_intake.human_player)}`)
            .append(
                `Climb: ${
                    matchData.auto_climb.attempted ? 
                    (matchData.auto_climb.failed ? "Failed" : "Succeeded") : 
                    "Did not attempt"
                }`
            )
            
            .append("TELEOP", Element.H1)
            .append(`Fuel Scored: ${matchData.teleop_fuel_scored}`)
            .append("Intake:")
            .append(`- Depot: ${MatchAccordion.getSymbol(matchData.teleop_intake.depot)}`)
            .append(`- Neutral Zone: ${MatchAccordion.getSymbol(matchData.teleop_intake.neutral_zone)}`)
            .append(`- Human Player: ${MatchAccordion.getSymbol(matchData.teleop_intake.human_player)}`)
            .append(`- Home Alliance: ${MatchAccordion.getSymbol(matchData.teleop_intake.home_alliance)}`)
            .append(`- Opponent Alliance: ${MatchAccordion.getSymbol(matchData.teleop_intake.opponent_alliance)}`)
            .append(`Trench/Bump Defense: ${MatchAccordion.getSymbol(matchData.teleop_defense)}`)
            .append(`Passing: ${MatchAccordion.getSymbol(matchData.teleop_passer)}`)
            .append(`Snowploughing: ${MatchAccordion.getSymbol(matchData.teleop_snowploughing)}`)
            .append(`Deposit to Human Player: ${MatchAccordion.getSymbol(matchData.teleop_human_player_deposit)}`)
            .append("Fouls:")
            .append(`- Minor: ${matchData.teleop_fouls.minor}`)
            .append(`- Major: ${matchData.teleop_fouls.major}`)
            
            .append("ENDGAME", Element.H1)
            .append(
                `Climb: ${
                    (matchData.endgame_climb_type === ClimbHeight.NO_ATTEMPT) ? 
                    "No Attempt" :
                    ((matchData.endgame_climb_failed ?
                        "Failed" :
                        matchData.endgame_climb_type
                    ) + ` at ${matchData.endgame_climb_time_remaining} seconds`)
                }`
            );

        this.bodyText.innerHTML = html.toString();
    }

    private static getSymbol(bool: boolean) {
        return bool ? "✔" : "✖";
    }

    public get isActive() {
        return this.domElement.classList.contains("active");
    }

    public toggle(force?: boolean) {
        const enabled = (force === null) ? !this.isActive : force;

        this.domElement.classList.toggle("active", enabled);
    }
}

export default class MatchDataSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");
    private readonly topBar = document.createElement("div");
    private readonly listContainer = document.createElement("div");
    private matchAccordions: MatchAccordion[] = [];

    constructor() {
        const expandAllButton = document.createElement("button");
        const collapseAllButton = document.createElement("button");

        expandAllButton.innerText = "Expand All";
        collapseAllButton.innerText = "Collapse All";

        expandAllButton.addEventListener("click", _ => this.matchAccordions.forEach(accordion => accordion.toggle(true)));
        collapseAllButton.addEventListener("click", _ => this.matchAccordions.forEach(accordion => accordion.toggle(false)));

        this.mainContainer.classList.add("match-data-page");
        this.listContainer.classList.add("matches");

        this.topBar.append(expandAllButton, collapseAllButton);
    }

    public setTeam(teamNumber: number) {
        const teamMatchDatas = AppData.quantitative_data.get(teamNumber);
        this.matchAccordions = [];

        if(teamMatchDatas) {
            for(const matchData of teamMatchDatas) {
                this.matchAccordions.push(new MatchAccordion(matchData));
            }

            this.domElement.replaceChildren(this.topBar, this.listContainer);

            this.listContainer.replaceChildren(...this.matchAccordions.map(accordion => accordion.domElement));
        } else {
            this.domElement.innerHTML = "<h1>No data found.</h1>";
        }
    }

    public get domElement() {
        return this.mainContainer;
    }
}