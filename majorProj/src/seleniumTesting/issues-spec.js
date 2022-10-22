var webdriver = require('selenium-webdriver');
var chrome = require('chromedriver');

const { By, Keys } = require('selenium-webdriver');
const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://localhost:4200/').then(function () {
    driver.getTitle().then(title => {

        if (title.localeCompare("List of Issues")) {
            console.log("Launch test Passed!")

            //test create issue
            driver.findElement(By.id("createIssue")).click();
            driver.findElement(By.id("occuranceDateTime")).sendKeys("23/10/2022 02:50")
            driver.findElement(By.id("requestorName")).sendKeys("testUser 1")
            driver.findElement(By.id("description")).sendKeys("Issue description test")
            driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[4]/div/div[2]/div[1]/input")).click()
            //selectByValue("Analytics - Dashboard")
            // let area  = Select(driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[4]/div/div[2]/div[1]/label")))
            // if(area.value == "Analytics - Dashboard" ){
            //     console.log("Radio btn works")
            // }
            // else{
            //     console.log("Radio btn failed")
            // }
            driver.findElement(By.id("status")).sendKeys("Pending test")
            driver.findElement(By.id("remarks")).sendKeys("testing")
        }
        })
    });
    
    driver.quit();
            // //test going issues form
            // driver.findElement(By.id("createIssue")).click();
            // driver.getTitle().then(title => {

            //     if (title.localeCompare("Issues")) {
            //         console.log("Open issue form test Passed!")
            //     else{
                    
            //     }

            //driver.findElement(By.id("createIssue")).sendKeys(Keys.ENTER)
            //driver.findElement(By.id("createIssue")).click();
            //let issuesFormURL = driver.getCurrentUrl();
            //console.log(driver.getCurrentUrl().toString())
            //if (driver.getCurrentUrl().startsWith("http://localhost:4200/issueForm/")) {
        //     if (driver.getWsUrl().startsWith("http://localhost:4200/issueForm/")) {
        //         console.log("create issue button test passed")
        //     }
        //     else {
        //         console.log("create issue button test failed")
        //     }
        // }
        // else {
        //     console.log("Launch test Failed!")
        //}
//     })
// });

// driver.quit();

// import { browser} from 'protractor'
// describe('Protractor Typescript Demo', function() {
// 	it('title verifications', function() {
// 	  browser.get('https://angularjs.org/');
// 	  browser.getTitle().then(function(title){
// 		console.log("The title is  : "+title)
// 		browser.sleep(5000);
// 	  })
// 	});
// });