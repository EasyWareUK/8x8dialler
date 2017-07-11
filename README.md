1) Libraries and frameworks: 
As this is a very small piece of work, I have decided not to use any libraries or Frameworks. They would normally make things easier but they are sometimes unnecessary and an overkill. They can make a small piece of work bloated. Secondly, the undue reliance on Frameworks often makes coder forget how to hand code with the native language. Had this project been larger, my preferred Frameworks would have been: AngularJS and Bootstrap plus JQuery library.

2) Dialling:
The dialler will not work unless the phone number is a proper number with at least one digit. I have nowhere to show an error, so I have used an alert popup.

3) Database and Browser issue.
The most trouble-free way to implement the database feature of this project for all browser types and versions is to use a separate/remote database. However for the sake of simplicity, I have decided to make this a standalone project. This raises issues of database browser compatibility. I have used the Web SQL browser database which should work on most smartphones. However, there is an issue with browser implementations of web SQL. Some browsers and some versions of certain browsers (eg FireFox) may not implement this database. For testing purposes, I would recommend either a smartphone or a Chrome browser. You may view the database details in your browser console.
database name: callogs
table name: logs
