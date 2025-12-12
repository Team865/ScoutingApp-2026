# Scouting App (2026)
This is the repository for the 2026 Scouting App.<br>
To host the app locally, please follow the following steps:
## Windows
1. Requirements: 
   1. NodeJS (specifically npm and npx, which should come pre-packaged with NodeJS)
   2. Python
2. NOTE: For all the following commands, please run them within the root directory. **DON'T** `cd .\scripts`
3. Run the following command after the initial download and any subsequent `git pull` just in case new packages have been added to the project:
```
.\scripts\setup.bat
```
4. To host the app locally, run:
```
.\scripts\deploy.bat
```
5. If you are making any changes, run the following command from a different terminal to rebuild without having to redeploy:
```
.\scripts\build.bat
```
6. Access the app via port 5000 (i.e. type `localhost:5000` into your browser)
7. Page routes:
   1. Scouting: `localhost:5000`
   2. Superscouting/Pit Scouting: `localhost:5000/superscouting`
   3. Analysis: `localhost:5000/analysis`
8. **Additional note: You can access the app from other devices** (i.e. mobile devices) by replacing `localhost:5000` with your host computer's ip address (see https://www.med.unc.edu/it/guide/operating-systems/how-do-i-find-the-host-name-ip-address-or-physical-address-of-my-machine/ for a guide on how to find it)
9. Get a TBA API key or set up an API key on TBA to use TBA data for teams. Store the key in a `.env` file (with no name) in the root directory. Your file should look like the following:
```
TBA_API_KEY=KEY_STRING
```
Where `KEY_STRING` is your API key. Don't wrap them in quotation marks.

## Mac & Linux
Unfinished, please view the .bat scripts used in the Windows setup and adapt accordingly.
