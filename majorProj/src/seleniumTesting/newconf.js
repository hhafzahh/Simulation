var webdriver = require('selenium-webdriver');
var chrome = require('chromedriver');

const { By, Keys, until } = require('selenium-webdriver');
const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://localhost:4200').then(function () {

    driver.findElement(By.id("username")).sendKeys("testUser")
    driver.findElement(By.id("email")).sendKeys("testUser@email.com")
    driver.findElement(By.id("password")).sendKeys("testuser")
    driver.findElement(By.xpath("/html/body/app-root/app-login/div/div/div/div/form/button")).click().then(function () {
        
        driver.sleep(1000);
        driver.navigate().refresh();
        driver.get('http://localhost:4200/home')
        driver.getTitle().then(title => {
            if (title.localeCompare("List of Issues")) {
                console.log("Launch test: Passed!");
                //Get number of rows
                ///html/body/app-root/app-home/div[3]/table/tbody/tr
                driver.findElements(By.xpath("/html/body/app-root/app-home/div[3]/table/tbody/tr")).then(function (tableRows) {
                    let numRows = tableRows.length
                    //console.log("no of tableRows :",numRows)

                    //Test create issue btn
                    driver.findElement(By.id("createIssue")).click().then(async found => { //Remove "createIssue" btn (fail)
                        console.log("Create btn test: Passed!")
                        //test create issue
                        driver.findElement(By.id("occuranceDateTime")).sendKeys("23/10/2022 02:50")
                        driver.findElement(By.id("requestorName")).sendKeys("testUser 1")
                        driver.findElement(By.id("description")).sendKeys("Issue description test")
                        driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[4]/div/div[2]/div[1]/input")).click()
                        driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[5]/div/div[2]/div[1]/input")).click()
                        driver.findElement(By.id("status")).sendKeys("Pending test")
                        driver.findElement(By.id("remarks")).sendKeys("testing")

                        //Click on the create btn - insert func
                        driver.findElement(By.id("createNew")).click()
                        // Wait for the alert to be displayed
                        await driver.wait(until.alertIsPresent());

                        // Store the alert in a variable
                        let alert = await driver.switchTo().alert();

                        //Store the alert text in a variable
                        let alertText = await alert.getText();
                        //console.log(alertText);

                        //Press the OK button
                        await alert.accept();

                        //Check insert work - the create alert text corresponds
                        if (alertText == "Created") {
                            console.log("Create Issue test: Passed!");

                            //Test retrieve
                            driver.get("http://localhost:4200/home");
                            driver.navigate().refresh();
                            ///html/body/app-root/app-home/div[2]/table/tbody/tr[5]/td[1]
                            ///html/body/app-root/app-home/div[2]/table/tbody/tr[last()]/td[1]
                            ///html/body/app-root/app-home/div[3]/table/tbody/tr[last()]/td[1]
                            let currentTixNum = await driver.findElement(By.xpath("/html/body/app-root/app-home/div[3]/table/tbody/tr[last()]/td[1]")).getText();
                            driver.findElements(By.xpath("/html/body/app-root/app-home/div[3]/table/tbody/tr")).then(function (rowsAfterInsert) {
                                let numRowsAfter = rowsAfterInsert.length
                                //console.log("numRowsAfter", numRowsAfter)
                                if (numRowsAfter === numRows + 1) { //Remove "+1" (fail)
                                    console.log("Retrieve Issue test: Passed!");

                                    //Test update issue - the ticket number corresponds to the id in URL 
                                    ///html/body/app-root/app-home/div[2]/table/tbody/tr[2]/td[9]/button    
                                    ///html/body/app-root/app-home/div[3]/table/tbody/tr[last()]/td[9]/button                                    
                                    driver.findElement(By.xpath("/html/body/app-root/app-home/div[3]/table/tbody/tr[last()]/td[9]/button")).click().then(async found => {
                                        var currentURL = await driver.getCurrentUrl();
                                        //console.log("currentURL: ",currentURL) 
                                        //console.log( "http://localhost:4200/issueForm/",currentTixNum )
                                        if (currentURL === "http://localhost:4200/issueForm/", currentTixNum) { //Remove ",currentTixNum" (fail)
                                            console.log("Edit btn test: Passed!");

                                            driver.findElement(By.id("status")).sendKeys("Edited")
                                            driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[4]/div/div[2]/div[2]/input")).click()
                                            driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[5]/div/div[2]/div[2]/input")).click()
                                            driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[8]/p[1]/button")).click().then(async found => {
                                                await driver.wait(until.alertIsPresent());
                                                // Store the alert in a variable
                                                let updateAlert = await driver.switchTo().alert();

                                                //Store the alert text in a variable
                                                let updateAlertText = await updateAlert.getText();
                                                //console.log(updateAlertText);

                                                //Press the OK button
                                                await alert.accept();

                                                if (updateAlertText == "Update Successfully!") {
                                                    console.log("Update Issue test: Passed!");
                                                }
                                                else { //Remove the text "Update Successfully!" in alert (fail)
                                                    console.log("Update Issue test: Failed!");
                                                    driver.get("http://localhost:4200/home")
                                                    driver.navigate().refresh();

                                                }
                                            })

                                            //Test delete issue - the create alert text corresponds
                                            driver.get("http://localhost:4200/home")
                                            //Click on the edit button from home page
                                            driver.findElement(By.xpath("/html/body/app-root/app-home/div[3]/table/tbody/tr[last()]/td[9]/button")).click()
                                            //driver.sleep(1000);
                                            driver.findElement(By.xpath("/html/body/app-root/app-issues/div/form/div/div[8]/p[2]/button")).click().then(async found => {
                                                await driver.wait(until.alertIsPresent());

                                                // Store the alert in a variable
                                                let deleteAlert = await driver.switchTo().alert();

                                                //Store the alert text in a variable
                                                let deleteAlertText = await deleteAlert.getText();
                                                //console.log(deleteAlertText);

                                                //driver.sleep(1000);
                                                //Press the OK button
                                                await alert.accept();

                                                if (deleteAlertText == "Delete Successfully!") {
                                                    //IF CAN TEST THAT DELETED TICKET NUMBER DOES NOT EXIST WOULD BE BETTER
                                                    // driver.get("http://localhost:4200/");
                                                    // driver.navigate().refresh();
                                                    // if(currentTixNum.length == 0)
                                                    console.log("Delete Issue test: Passed!")
                                                    driver.quit();
                                                }
                                                else { //Remove the text "Delete Successfully!" in alert (fail)
                                                    console.log("Delete Issue test: Failed!")
                                                    driver.quit();
                                                }
                                            });



                                        } else {
                                            console.log("Edit btn test: Failed!")
                                            driver.quit();;
                                        }
                                    })


                                } else {
                                    console.log("Retrieve Issue test: Failed!")
                                    driver.quit();
                                }
                            })


                        }
                        else { //Remove the text "Created" in alert (fail)
                            console.log("Create Issue test: Failed!")
                            driver.quit();
                        }

                    }).then(null, function (err) {
                        if (err.name === "NoSuchElementError")
                            console.log("Create btn test: Failed!");
                    });
                })
            }

            else {
                console.log("Launch test: Failed!")
                driver.quit();
            }
        })
    })
});
