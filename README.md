# Simulation

### Observations & Inspirations 

During SIP, We noticed that some of the tasks in the operations teams were manual and thus wanted to make it more accessible and efficient. 
One scenario we observed was that the data of the defect tickets had to be manually added from the downloaded excel from SharePoint to a masterlist excel thereafter, load the updated masterlist excel in Qlik Sense. 
Before uploading it in a visualization, they would check the data if there is any inconsistency in the formats and whether the data is accurate. 


### Objective of Project

Since the current system requires a lot of manual input by user when transferring data of tickets, the objective of this project is to enhance efficiency through the automation of data processing from the application to a dashboard.
The completed product aims to help simplify and speed up data transfer process, where data from the website would be automatically formatted and loaded into the dashboard, making the process easy and efficient. By using the completed product, it will help to remove repetitive operations tasks and help to increase efficiency and productivity.

### Solution
Our team decided to create a solution to enhance task recording process in the operations team.
We use other technologies to simulate the environment, and we use python for data cleaning and formatting.

### _To simulate the environment:_
| Technology Used Initially  |  Alternative Used |
| ------------- | ------------- |
| Pega [Java Low Code with SQL Database]  | MEAN Stack [Angular with MongoDB Database]  |
| QlikSense   | Tableau  |

##### To make it better, Automation with Python and Jenkins

### Flow of the project
-	A simple ticket management system and store data form input in database
-	Integrate MongoDB with python 
-	Export cleaned data as a csv file
-	Load file into tableau
-	Create a dashboard to present performance
-	Automate data cleaning and data formatting
-	Using Jenkins for CI/CD pipeline



