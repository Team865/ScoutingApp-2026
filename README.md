# Scouting App (2026)
This is the repository for the 2026 Scouting App.<br>
To host the app locally, please follow the following steps:
## Windows
> [!IMPORTANT] 
> Prerequisite Requirements:<br>
> - NodeJS (specifically npm and npx, which should come pre-packaged with NodeJS)<br>
> - Python<br>
> - [UV Python Package/Project Manager](https://docs.astral.sh/uv/)<br>

1. Run the following command after the initial download and any subsequent `git pull` just in case new packages have been added to the project:
   * The command below and any subsequent command needs to be run in a terminal (emulator) such as `Command Prompt` or `Powershell`
```
.\scripts\setup.bat
```
2. Get the `service_account.json` file from somebody who has the Google API credentials.
3. Setup the `.env` file (with no name) in the root directory. Your file contents should look like the following:
```
TBA_API_KEY=KEY_STRING
SHEETS_ID=ID_STRING
EVENT_KEY=EVENT_KEY_STRING
IS_PROD=BOOLEAN
```
> [!NOTE]
> **Don't add a space before or after the equal signs.**<br>
> Don't wrap any of the STRING values in quotation marks. Just write the value as is (i.e. put `TBA_API_KEY=lris2903` instead of `TBA_API_KEY="lris2903"`)
<table>
   <tr>
      <th>.env Name</th>
      <th>Value</th>
   </tr>
   <tr>
      <td>TBA_API_KEY</td>
      <td>Your TheBlueAlliance API key. Get one yourself at https://www.thebluealliance.com/account or from a lead.</td>
   </tr>
   <tr>
      <td>SHEETS_ID</td>
      <td>The Spreadsheet ID of the google sheets (see https://developers.google.com/workspace/sheets/api/guides/concepts). Do note that this is the spreadsheet ID, NOT A (WORK)SHEET ID</td>
   </tr>
   <tr>
      <td>EVENT_KEY</td>
      <td>Your TheBlueAlliance event key. For example for Centennial 2025 (https://www.thebluealliance.com/event/2025onsca), the key would be 2025onsca. The key can be found in the url of the TBA link.</td>
   </tr>
   <tr>
      <td>IS_PROD</td>
      <td>A boolean (represented as a 0 or 1, write it as a number and not as false/true) which represents the current environment context. If the value is false (0), then scripts will run in a development context (which will add tools like source maps). If the value is true (1), then scripts will run in a production context (files will be built for distribution).</td>
   </tr>
</table>

4. To host the app locally, run:
```
.\scripts\deploy.bat
```
5. If you are making any changes to **TypeScript** files, run the following command from a different terminal to rebuild without having to redeploy:
```
.\scripts\build.bat
```
> [!IMPORTANT]
> You don't need to rebuild CSS files, they automatically update (just refresh the page)
> If you make changes to python or HTML files, you will need to rerun the `deploy.bat` file because they don't get hot reloaded.

6. Access the app via port 5000 **(or 5005 if IS_PROD is 0)** (i.e. type `localhost:5000` into your browser)
7. Page routes:
   * Scouting: `localhost:5000`
   * Superscouting/Pit Scouting: `localhost:5000/superscouting`
   * Analysis: `localhost:5000/analysis`
   
> [!TIP]
> **You can access the app from other devices** (i.e. mobile devices) by replacing `localhost` with your host computer's ip address (i.e. `XXX.XXX.X.X:5000`) (see https://www.med.unc.edu/it/guide/operating-systems/how-do-i-find-the-host-name-ip-address-or-physical-address-of-my-machine/ for a guide on how to find it)

## Mac & Linux
Unfinished, please view the .bat scripts used in the Windows setup and adapt accordingly.
