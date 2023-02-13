# %% [markdown]
# # <center> Loading data from mongoDB <center> #

# %%
import certifi
import pymongo
from pymongo import MongoClient

client = MongoClient("mongodb+srv://test1:testone1@cluster0.s4jld.mongodb.net/Major-proj?retryWrites=true&w=majority", tlsCAFile=certifi.where())
# Database Name
db = client["Major-proj"]
 
# Collection Name
col = db["issues"]
 
x = col.find()
 
for data in x:
    print(data)

# %%
import pandas as pd
import joblib
#import matplotlib.pyplot as plt
import numpy as np

# %%
#Present data as dataframe
df = pd.DataFrame(list(col.find()))
df

# %% [markdown]
# # <center> Data cleaning and formatting <center> #

# %% [markdown]
# <h2> Check if datetime values are valid 

# %%
exceptionList = []
for index, row in df.iterrows():  
    try:
        pd.to_datetime(row['occuranceDateTime']).strftime('%d/%m/%Y %H:%M')
        #print(row['_id'], 'Date time is valid')
    
    except ValueError:
        pass
        exceptionList.append(row['_id'])
        #print(exceptionList)
        dateTime_check = exceptionList, 'Invalid datetime format.'
        print(dateTime_check)

if len(exceptionList) == 0:
    dateTime_check = 'All Datetime is valid.'
    print(dateTime_check)

# %%
#Remove rows that have invalid datetime
for i in exceptionList:
    df = df[df._id != i]
df            

# %% [markdown]
# <h2> Format occuranceDateTime and Business are into desirable format 

# %%
#Split occuranceDateTime to OccuranceDate and OccuranceTime
df["OccuranceDate"] = pd.to_datetime(df["occuranceDateTime"]).dt.strftime('%d/%b/%Y')
df["OccuranceTime"] = pd.to_datetime(df["occuranceDateTime"]).dt.time

#Split OccuranceDate into month and year and create a seperate column for OccuranceMonth and OccuranceYear
df["OccuranceMonth"] = df["OccuranceDate"].str.split('/').str[1]
df["OccuranceYear"] = df["OccuranceDate"].str.split('/').str[-1]

#Split area and create a new column, named as 'Business Area (report) and Business Area
df[['Business Area (report)','Business Area']] = df["area"].str.split('-',expand=True)
print(df)

# %% [markdown]
# <h2> Data cleaning - handle missing values by replacing it with NaN

# %%
#Working - Handle missing values: Fill all blanks and 'N.A.' to NaN
df = df.replace(['','N.A.', 'NA','na','n.a.', 'nil', 'NIL', 'Nil', 'NIl', 'niL'], np.NaN)
df

# %% [markdown]
# <h2> Data cleaning - handling duplicated data by removing the record 

# %%
#Working - Remove dups - remove those rows that are duplicated except the '_id' column
duplicateRowsDF = df[df.duplicated(['occuranceDateTime', 'requestorName', 'description', 'area', 'team', 'status', 'remarks', 'OccuranceDate', 'OccuranceMonth', 'OccuranceYear', 'Business Area (report)', 'Business Area'])]

index = duplicateRowsDF.index

df = df.drop(index)
df

# %% [markdown]
# <h2> Data cleaning - ensure that business area aligns with assigned team 

# %%
#Compare the "Business Area" and "team" values
teamField_checker_list = []
for index, row in df.iterrows():
    teamSplitted = row['team'].split()[0].strip()
    
    if (teamSplitted != row['Business Area (report)'].strip()):
        teamField_checker = row['_id']
        teamField_checker_list.append(row['_id'])
        formatText = 'Team field check results:'
        teamField_result = formatText + str(teamField_checker_list)
        #print('Need to fix Business Area/Assigned Team:', teamField_checker_list)
    
if len(teamField_checker_list) == 0:
    teamField_result = 'All team fields are correct.'
    
print(teamField_result)

# %% [markdown]
# <h2> Data cleaning - checking for inconsistencies (typo) using spellchecker

# %%
from spellchecker import SpellChecker
from textblob import Word
from textblob import TextBlob
import re

spell = SpellChecker()
description = df["description"]

for words in description:
    descriptionTB = TextBlob(words)
    splittedWords = words.split()
    #print(splittedWords)

    #Remove punctuation signs
    #by doing 'for word in words' helps to for loop for the row is it loop at (line 8), you get 4 rows of ouput instead of 16
    cleanedWords = [word.lower() for word in splittedWords]
    cleanedWords = [re.sub(r'[^A-Za-z0-9]+', '', word) for word in splittedWords]
    #print(cleanedWords)
    
    #find those words that may be misspelled
    misspelled = list(spell.unknown(cleanedWords))
    #print("Possible list of misspelled words in the original text:\n",misspelled)
    
    #print(' '.join(misspelled))
    #missspelled_row = ' '.join(misspelled)
    #print(descriptionTB)
    for word in misspelled:
        correctWord = spell.correction(word)
        joined = [correctWord.join(correctWord)]
    descriptionTBNew = ''.join(descriptionTB.correct())
    #print(descriptionTBNew, "descriptionTBNew")
    
    #print(len(misspelled))
    if len(misspelled) > 0:
        for index, row in df.iterrows():
            if row['description'] == descriptionTB:
                #print(index)
                df.loc[index, "description"] = descriptionTBNew

df

# %% [markdown]
# # <center> Sending out check report through email <center> #

# %%
from flask import Flask
from flask_mail import Mail, Message
from email.mime.text import MIMEText

app = Flask(__name__)

mail_settings = {
"MAIL_SERVER": "smtp.gmail.com",
"MAIL_USE_TLS": False,
"MAIL_USE_SSL": True,
"MAIL_PORT": 465,
"MAIL_USERNAME": "mp.hjtest@gmail.com",
"MAIL_PASSWORD": "nrqmlxfeblevvbbp"
}

app.config.update(mail_settings)
mail = Mail(app)

receiver_list = ['majorprojectreceiver@gmail.com']

with app.app_context():
    msg = Message(sender=app.config.get("MAIL_USERNAME"), recipients=receiver_list)
    msg.subject = "Automation report"
    b = str(dateTime_check)
    c = teamField_result
    result = b + '\n' + c
    msg.html = result
    mail.send(msg)
    

# %% [markdown]
# # <center> Writing cleaned and formatted dataframe to csv file <center> #

# %%
df

# %%
df.to_csv('MP_dataset.csv', index = False, na_rep=np.NaN)


