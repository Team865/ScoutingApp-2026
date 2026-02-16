import CheckboxGroup from "./components/CheckboxGroup";
import FuelCounter from "./components/FuelCounter"
import LabeledCheckbox from "./components/LabeledCheckbox"

const mainElement: HTMLElement = document.querySelector("main");
const testFuelCounter = new FuelCounter();
const testCheckbox = new LabeledCheckbox("PLACEHOLDER");
const testCheckboxGroup = new CheckboxGroup("TEST GROUP", ["Option 1", "Option 2", "dijqijowdojiqiowd"]);

mainElement.appendChild(testFuelCounter.domElement);
mainElement.appendChild(testCheckbox.domElement);
mainElement.appendChild(testCheckboxGroup.domElement);