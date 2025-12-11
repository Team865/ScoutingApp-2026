# WARNING: THIS SCRIPT WILL DELETE ANY EXISTING JS SCRIPTS IN THE HEAD IF IT DOESN'T EXIST IN THE BUILD FOLDER

# EDIT THIS LINE
pages = [
    "superscouting"
]

exclude = ["main.ts"]
# EDIT THE LINE ABOVE

from pathlib import Path
from bs4 import BeautifulSoup
import re

for page in pages:
    jsFolderPath = Path(f"./build/{page}")
    htmlFilePath = Path(f"{page}.html")

    modules = ["./" + jsFile.as_posix() for jsFile in jsFolderPath.rglob("*.js") if jsFile.name not in exclude]

    with open(htmlFilePath, "rt+") as htmlFile:
        htmlContents = htmlFile.read()
        soup = BeautifulSoup(htmlContents, "html.parser")
        headElement = soup.find("head")

        # Remove any pre-existing imports
        for script in headElement.find_all("script", {"src": re.compile(r".+\.js")}):
            script.extract()

        for module in modules:
            headElement.append(soup.new_tag("script", attrs={"type": "module", "src": module}))

        htmlFile.seek(0)
        htmlFile.truncate()
        htmlFile.write(str(soup))