import FuelCounter from "./components/FuelCounter"
import LabelCheckbox from "./components/LabelCheckbox"

const mainElement: HTMLElement = document.querySelector("main");
const testFuelCounter = new FuelCounter();
const testCheckbox = new LabelCheckbox("PLACEHOLDER");

mainElement.appendChild(testFuelCounter.domElement);
mainElement.appendChild(testCheckbox.domElement);