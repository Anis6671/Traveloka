const prompt = require("prompt-sync")()
//import Menu, BrowserWindow and app modules in our application 
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { contextIsolated } = require('process');

var mainWindow;
var addWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));//launch page at npm start

  var mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu);
 
   //Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("item:add", function(e,item){
  mainWindow.webContents.send("item:add", item)
  addWindow.close()
})
//Create an array of menus

var mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label: 'Add new item',
        click(){
            addWindow = new BrowserWindow({
            width: 800,
            height: 600,
            title:"Add new item",

            webPreferences:{
              nodeIntegration: true,
              contextIsolation: false
            }

          });
        
          // and load the index.html of the app.
          addWindow.loadFile(path.join(__dirname, 'add.html'));
        }
      },
      {label: 'Update',
      click(){
          addWindow = new BrowserWindow({
          width: 800,
          height: 600,
          title:"Update",

          webPreferences:{
            nodeIntegration: true,
            contextIsolation: false
          }

        });
      
        // and load the index.html of the app.
        addWindow.loadFile(path.join(__dirname, 'update.html'));
      }},
      {
        label: 'Clear all item',
        click(){
          mainWindow.webContents.send("item:clear");
        }
      },
      {
        label: 'Quit/Exit',
        click(){
          app.quit()
        }
      }
    ]
  },
  {
    label:"Help"
  }
];

function displayCountryInfo() {
    const country = document.getElementById("searchData").value;
    fetch(`https://restcountries.com/v3.1/all`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            const countryData = data.find(item => item.name.common.toLowerCase() === country.toLowerCase());
            if (!countryData) {
                throw new Error('Country not found');
            }
            console.log(countryData);

            // Extract relevant information
            const commonName = countryData.name.common;
            const officialName = countryData.name.official;
            const capital = countryData.capital ? countryData.capital[0] : 'N/A';
            const currencies = Object.values(countryData.currencies).map(curr => curr.name);
            const region = countryData.region;
            const languages = Object.values(countryData.languages).map(lang => lang);
            const population = countryData.population;
            const flag = countryData.flags.png;
            const latitude = countryData.latlng[1];
            const longitude = countryData.latlng[0];
            const continent = countryData.continents;
            const googleMapLink = `https://www.google.com/maps/place/${latitude},${longitude}`;

            // Display information in HTML elements
            document.getElementById("commonName").innerHTML = `Common Name: ${commonName}`;
            document.getElementById("officialName").innerHTML = `Official Name: ${officialName}`;
            document.getElementById("capital").innerHTML = `Capital: ${capital}`;
            document.getElementById("currencies").innerHTML = `Currencies: ${currencies.join(', ')}`;
            document.getElementById("region").innerHTML = `Region: ${region}`;
            document.getElementById("languages").innerHTML = `Languages: ${languages.join(', ')}`;
            document.getElementById("population").innerHTML = `Population: ${population}`;
            document.getElementById("flag").src = flag;
            document.getElementById("continent").innerHTML = `Continent: ${continent}`;
            document.getElementById("googleMapLink").href = googleMapLink;
            document.getElementById("googleMapLink").textContent = `Google Map`;
        })
        .catch((error) => {
            console.error('Error during fetch operation:', error);
        });
}

// Add event listener to the button
document.getElementById("searchButton").addEventListener("click", displayCountryInfo);
