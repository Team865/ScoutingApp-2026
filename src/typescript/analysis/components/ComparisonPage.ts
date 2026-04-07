import { getMean, getMedian } from "../../lib/MathUtil";
import AppData from "../AppData";
import Table from "./Table";

enum TeamData {
    EPA = "EPA",
    MeanDriveSkill = "Mean Drive Skill",
    MedianDriveSkill = "Median Drive Skill",
    MeanDefenseSkill = "Mean Defense Skill",
    MedianDefenseSkill = "Median Defense Skill"
}

const dataGetterLookup = new Map<TeamData, (teamNumber: number) => number>();

dataGetterLookup.set(TeamData.EPA, (teamNumber) => {
    const teamData = AppData.superscouting.fetched_team_data.find(data => data.number == teamNumber);

    return teamData.epa || teamData.normalized_epa || Number.NaN;
});

dataGetterLookup.set(TeamData.MeanDriveSkill, (teamNumber) => {
    const teamDatas = AppData.quantitative_data.get(teamNumber);

    if(teamDatas === undefined) return Number.NaN;

    return getMean(teamDatas.map(matchData => matchData.driver_skill));
});

dataGetterLookup.set(TeamData.MedianDriveSkill, (teamNumber) => {
    const teamDatas = AppData.quantitative_data.get(teamNumber);

    if(teamDatas === undefined) return Number.NaN;

    return getMedian(teamDatas.map(matchData => matchData.driver_skill));
});

dataGetterLookup.set(TeamData.MeanDefenseSkill, (teamNumber) => {
    const teamDatas = AppData.quantitative_data.get(teamNumber);

    if(teamDatas === undefined) return Number.NaN;

    const matchesWithDefense = teamDatas.filter(data => data.teleop_defense);
    if(matchesWithDefense.length == 0) return Number.NaN;

    return getMean(matchesWithDefense.map(matchData => matchData.defense_skill));
});


dataGetterLookup.set(TeamData.MedianDefenseSkill, (teamNumber) => {
    const teamDatas = AppData.quantitative_data.get(teamNumber);

    if(teamDatas === undefined) return Number.NaN;

    const matchesWithDefense = teamDatas.filter(data => data.teleop_defense);
    if(matchesWithDefense.length == 0) return Number.NaN;

    return getMedian(matchesWithDefense.map(matchData => matchData.defense_skill));
});

export default class ComparisonPage {
    public readonly domElement = document.createElement("div");
    public readonly exitButton = document.createElement("button");
    private readonly exportButton = document.createElement("button");
    private readonly batchTeamNumbers = document.createElement("button");

    private readonly tableContainer = document.createElement("div");
    private readonly table = new Table("Team");

    constructor() {
        const addColumnButton = document.createElement("button");
        const addRowButton = document.createElement("button");

        this.tableContainer.style.display = "grid";

        addColumnButton.innerText = "+";
        addRowButton.innerText = "+";

        this.table.domElement.style.gridRow = "1";
        this.table.domElement.style.gridColumn = "1";

        addColumnButton.style.gridRow = "1";
        addColumnButton.style.gridColumn = "2";

        addRowButton.style.gridRow = "2";
        addRowButton.style.gridColumn = "1";

        this.exitButton.innerText = "EXIT";
        this.exportButton.innerText = "EXPORT TO CSV";
        this.batchTeamNumbers.innerText = "BATCH ADD TEAMS";

        this.table.domElement.id = "comparison-table";

        this.tableContainer.append(this.table.domElement, addColumnButton, addRowButton);
        this.domElement.append(this.exitButton, this.exportButton, this.batchTeamNumbers, this.tableContainer);

        addColumnButton.addEventListener("click", _ => {
            this.table.addColumn();
            this.table.getCell(0, this.table.columns - 1).appendChild(this.getDataDropdown());
            this.updateTable();
        });

        addRowButton.addEventListener("click", _ => {
            this.table.addRow();
            this.table.getCell(this.table.rows - 1, 0).appendChild(this.getTeamNumberDropdown());
            this.updateTable();
        });

        this.exportButton.addEventListener("click", _ => {
            let csv = "";

            {
                const firstRow = this.table.getRow(0);

                csv += firstRow[0].textContent;

                if(firstRow.length > 1) {
                    csv += "\t";
                    csv += firstRow.slice(1).map(cell => cell.querySelector("select").value).join("\t");
                }

                if(this.table.columns > 1) {
                    for(const row of this.table.cells.slice(1)) {
                        csv += "\n";
                        csv += row[0].querySelector("select").value;

                        if(row.length > 1) {
                            csv += "\t";
                            csv += row.slice(1).map(cell => cell.textContent).join("\t");
                        }
                    }
                }
            }

            navigator.clipboard.writeText(csv);
            alert("Copied to clipboard!");
        });

        this.batchTeamNumbers.addEventListener("click", _ => {
            const input = prompt("Enter the team numbers you would like to add (separated by commas): ");

            try {
                const teamNumbers = input.split(",").map(teamNumberStr => Number.parseInt(teamNumberStr.trim()));

                for(const teamNumber of teamNumbers) {
                    if(!AppData.teamNumbers.includes(teamNumber)) throw new Error(`${teamNumber} is not a valid team number`);

                    this.table.addRow();

                    const teamNumberDropdown = this.getTeamNumberDropdown();
                    teamNumberDropdown.value = teamNumber.toString();
                    this.table.getCell(this.table.rows - 1, 0).appendChild(teamNumberDropdown);
                }
            } catch (e) {
                alert(e);
            } finally {
                this.updateTable();
            }
        });
    }

    public getTeamNumberDropdown(): HTMLSelectElement {
        const select = document.createElement("select");

        for(const teamNumber of AppData.teamNumbers) {
            const option = document.createElement("option");
            option.innerText = teamNumber.toString();
            option.value = teamNumber.toString();
            select.appendChild(option);
        }

        {
            const option = document.createElement("option");
            option.innerText = "REMOVE";
            option.value = "remove";
            select.appendChild(option);
        }

        select.addEventListener("change", _ => {
            if(select.value === "remove") {
                this.table.removeRow(Number.parseInt(select.parentElement.style.gridRow) - 1);
            } else {
                this.updateTable();
            }
        });

        return select;
    }

    public getDataDropdown(): HTMLSelectElement {
        const select = document.createElement("select");

        for(const dataOption of Object.values(TeamData)) {
            const option = document.createElement("option");
            option.innerText = dataOption;
            option.value = dataOption;
            select.appendChild(option);
        }

        {
            const option = document.createElement("option");
            option.innerText = "REMOVE";
            option.value = "remove";
            select.appendChild(option);
        }
        select.addEventListener("change", _ => {
            if(select.value === "remove") {
                this.table.removeColumn(Number.parseInt(select.parentElement.style.gridColumn) - 1);
            } else {
                this.updateTable();
            }
        });

        return select;
    }

    private updateTable(): void {
        if(this.table.columns < 2) return;
        if(this.table.rows < 2) return;

        const dataGetters = this.table.getRow(0).slice(1).map(cell => dataGetterLookup.get(cell.querySelector("select").value as TeamData));

        for(const row of this.table.cells.slice(1)) {
            const teamNumber = Number.parseInt((row[0].querySelector("select") as HTMLSelectElement).value);

            for(let columnIndex = 1; columnIndex < row.length; columnIndex++) {
                row[columnIndex].innerText = dataGetters[columnIndex - 1](teamNumber).toString();
            }
        }
    }
}