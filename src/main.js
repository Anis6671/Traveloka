const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;

// Create main window function
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle fetch-country-data event from renderer process
ipcMain.on('fetch-country-data', async (event, searchInput) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${searchInput}`);
        const countryData = response.data[0]; // Assuming the first result is the desired country
        event.reply('country-data', {
            commonName: countryData.name.common,
            officialName: countryData.name.official,
            capital: countryData.capital,
            currencies: Object.values(countryData.currencies).map(curr => curr.name),
            region: countryData.region,
            languages: Object.values(countryData.languages),
            population: countryData.population,
            flag: countryData.flags.png,
            location: {
                latitude: countryData.latlng[0],
                longitude: countryData.latlng[1]
            },
            continent: countryData.continents
        });
    } catch (error) {
        console.error('Error fetching country data:', error);
        event.reply('country-data', null); // Sending null in case of error
    }
});
