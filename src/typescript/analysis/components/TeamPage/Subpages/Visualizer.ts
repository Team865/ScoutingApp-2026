import { CategoryScale, Chart, ChartConfiguration, ChartData, ChartDataset, LinearScale, LineController, LineElement, PointElement, Tooltip } from "chart.js";
import SubpageInterface from "./SubpageInterface";
import { ScoutingData } from "../../../../scouting/AppData";
import AppData from "../../../AppData";
import Signal from "../../../../lib/dataTypes/Signal";
import { getClimbValue } from "../../../util/ClimbValue";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip
);

Chart.defaults.color = "#fff";
Chart.defaults.borderColor = "rgb(90, 89, 89)";
Chart.defaults.datasets.line.backgroundColor = "#fff";

class ChartOption {
    public readonly domElement = document.createElement("div");
    public readonly name: string
    public readonly colorPicker = document.createElement("input");
    public readonly checkbox = document.createElement("input");

    public readonly changed = new Signal<void>();

    private readonly valueGetter: (match: ScoutingData) => number;

    constructor(optionName: string, valueGetter: (match: ScoutingData) => number, defaultColor?: string) {
        this.name = optionName;
        this.valueGetter = valueGetter;

        const label = document.createElement("label");

        this.domElement.classList.add("labeled-checkbox");

        this.colorPicker.type = "color";
        this.colorPicker.value = defaultColor || "#ffffff";

        label.innerText = optionName;
        label.htmlFor = optionName;

        this.checkbox.id = optionName;
        this.checkbox.type = "checkbox";

        this.checkbox.addEventListener("input", _ => this.changed.emit());
        this.colorPicker.addEventListener("focusout", _ => this.changed.emit());

        this.domElement.append(this.colorPicker, this.checkbox, label);
    }

    public getDataset(teamDatas: ScoutingData[]): ChartDataset {
        return {
            label: this.name,
            data: [...teamDatas.map(match => this.valueGetter(match))],
            borderColor: this.colorPicker.value
        };
    }

    public get checked() {
        return this.checkbox.checked;
    }
}

export default class VisualizerSubpage implements SubpageInterface {
    private readonly mainContainer = document.createElement("div");
    private readonly chartCanvas = document.createElement("canvas");
    private readonly horizontalLine = document.createElement("hr");
    private readonly chartOptionsContainer = document.createElement("div");

    private readonly chartOptions: ChartOption[] = [];
    private teamDatas: ScoutingData[] | undefined = undefined;

    private readonly chartConfig: ChartConfiguration = {
        type: "line",
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                x: {
                    title: {
                        text: "Match Number",
                        display: true
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: function(context) {
                            return `Match ${context[0].label}`
                        }
                    }
                }
            }
        }
    };

    private readonly chart = new Chart(this.chartCanvas, this.chartConfig);
    
    constructor() {
        this.mainContainer.classList.add("data-visualizer-page");
        this.chartOptionsContainer.classList.add("options");

        this.addOption("Total Fuel Scored", match => match.auto_fuel_scored + match.teleop_fuel_scored, "#f0e04b");
        this.addOption("Teleop Fuel Scored", match => match.teleop_fuel_scored, "#f0824b");
        this.addOption("Auto Fuel Scored", match => match.auto_fuel_scored, "#5c4bf0");
        this.addOption("Climb Points", match => getClimbValue(match), "#37cc34");
        this.addOption("Total Fouls", match => match.teleop_fouls.minor + match.teleop_fouls.major, "#bd0101");
        this.addOption("Minor Fouls", match => match.teleop_fouls.minor, "#a34bf0");
        this.addOption("Major Fouls", match => match.teleop_fouls.major,"#f04b4b");
        this.addOption("Defense Skill", match => match.defense_skill,"#47aed7");
    }

    private addOption(optionName: string, valueGetter: (match: ScoutingData) => number, defaultColor?: string) {
        const chartOption = new ChartOption(optionName, valueGetter, defaultColor);

        this.chartOptions.push(chartOption);

        this.chartOptionsContainer.appendChild(chartOption.domElement);

        chartOption.changed.connect(this.refreshGraph.bind(this));
    }

    public setTeam(teamNumber: number) {
        this.teamDatas = AppData.quantitative_data.get(teamNumber);

        if(this.teamDatas === undefined) {
            this.mainContainer.innerHTML = "<h1>NO DATA FOUND</h1>";
            return;
        }

        this.refreshGraph();
    }

    private refreshGraph() {
        const enabledOptions = this.chartOptions.filter(option => option.checked);

        this.chart.data.datasets.splice(0);
        this.chart.data.labels = Array.from(new Set(this.teamDatas.map(match => match.match_number)));

        for(const option of enabledOptions) {
            this.chart.data.datasets.push(option.getDataset(this.teamDatas));
        }

        const startScroll = window.scrollY;
        this.chart.update();
        this.mainContainer.replaceChildren(this.chartCanvas, this.horizontalLine, this.chartOptionsContainer);
        window.scroll({
            top: startScroll
        });
    }

    public get domElement() {
        return this.mainContainer;
    }
}