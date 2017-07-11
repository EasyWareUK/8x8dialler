/* GLOBAL VARIABLES .... */
var db;  //web SQL database
var startTime = 0;
var stopTimer = false;
var currScreen = "";  //The currently dynamically-loaded screen
var reportMsg = "";
var webSqlOK = true;
/* EBD, GLOBAL VARIABLES .... */


	function init()
	{
		try{
			
				db = openDatabase('callogs', '1.0', 'Call Log Database', 2 * 1024 * 1024);
				db.transaction(function (transaction) 
				{
					transaction.executeSql('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, number TEXT, duration NUMERIC)');
					
					//transaction.executeSql("INSERT INTO logs (number, duration) VALUES ('12345', 4000)"); 
				});
		}
		catch(err) {
				webSqlOK = false;
				alert("Error: this browser may not support Web SQL database: \n Database functions may not work on this browser.");
		}
	
		doListeners();
	}
	
	function doListeners()
	{
		var classname = document.getElementsByClassName("btn");
		
		for (var i = 0; i < classname.length; i++) {
			classname[i].addEventListener('click', addNumber, false);
		}
		
		document.getElementById("dialBtn").addEventListener('click', dialNumber, false);
	}
	
	function clearTopBar()
	{
		document.getElementById("timer").innerHTML = "";
		document.getElementById("number").innerHTML = "";
		startTime = 0;
	}
	
	function addNumber()
	{
		var attribute = this.getAttribute("id");
		document.getElementById("number").innerHTML += ("" + attribute).trim();
	}
	
	
	function dialNumber()
	{
		var numbertoDial = document.getElementById("number").innerHTML.trim();
		
		if(numbertoDial.length < 1)
		{
			alert("Please enter a phone number");
		}
		else if (isNaN(numbertoDial)){
			//console.log("Error.. not a number" + numbertoDial);
			alert("Error: " + numbertoDial + " is not a number: ");
			document.getElementById("number").innerHTML = "";
		}
		else
		{
			showDuration(startTime);
			loadScreen("hangupPage.html", doHangupClick)
		}
	}
	
	function doHangupClick()
	{
		document.getElementById("hangupBtn").addEventListener('click', hangUp, false);
	}
	
	function doDialClick()
	{
		doListeners();
	}
	
	
	function hangUp()
	{
		loadScreen("keypadPage.html", doDialClick)
		stopTimer = true;
		saveCall(document.getElementById("number").innerHTML, startTime); 
		clearTopBar();
		
	}
	
	function saveCall(number, duration) 
	{
		if(!webSqlOK)
		{
			
			return;
		}
		
		db.transaction(
			function( transaction ){
				
				transaction.executeSql(
					("INSERT INTO logs (number, duration) VALUES ('" + number + "', " + duration + ")"),
					[],
					function( transaction, results ){
						//callback(results);
						//console.log("do the callback here,....")
						doReport();
					}
				); 
			}
		);
	}
	
	
	
	function doReport() 
	{
		db.transaction(
			function( transaction ){
				
				transaction.executeSql(
					("SELECT COUNT(id) as count FROM logs"),
					[],
					function( transaction, results ){
						var row = results.rows.item(0);
       					var rowCount = row.count;
						console.log("TOTAL NUMBER OF CALLS: " + rowCount);
						reportMsg = "TOTAL NUMBER OF CALLS: " + rowCount + "\n\n"; 
					}
				); 
				
				
				transaction.executeSql(
					("SELECT number, COUNT(number) as count FROM logs GROUP BY number ORDER BY count DESC LIMIT 5"),
					[],
					function( transaction, results ){
						for (var i=0; i < results.rows.length; i++)
						{
							row = results.rows.item(i);
							console.log("Number: " + row.number + "; count = " + row.count);
							reportMsg += "Number: " + row.number + "; count = " + row.count + "\n";
						}
						
						alert(reportMsg);
						reportMsg = "";
					}
				); 
			}
		);
	}
	
	

	
	function showDuration(addSecs) {
		if (addSecs == 10000){
			hangUp();
		}
		
		if(stopTimer)
		{
			clearTimeout(t);
			stopTimer = false;
			return;
		}

        var today = new Date(addSecs),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
        document.getElementById('timer').innerHTML = "Call time: " + h + ":" + m + ":" + s;
        t = setTimeout(function () {
            showDuration(startTime+=1000)
        }, 1000);
    }
	
	function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }
	
	
	
	

	function loadScreen(theScreen, callBack)
	{
		currScreen = theScreen;
		ajax_request(theScreen, "", "GET", callBack, true); 
	}	
	
		
	function ajax_request(theURL, params, type, callBack, loadContents)
	{
        var httpRequest;
        
        if (window.XMLHttpRequest) //Non-IE
        {
            httpRequest = new XMLHttpRequest();
            if (httpRequest.overrideMimeType) 
            {
                httpRequest.overrideMimeType('text/xml');
            }
        } 

        if (!httpRequest) 
            return false;
            
        httpRequest.onreadystatechange = function() { processResponse(httpRequest, callBack, loadContents); };

        if (type=="GET")
        {
	        httpRequest.open('GET', theURL, true);
        	httpRequest.send('');
        }
        else
        {
			httpRequest.open("POST", theURL, true);
			httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //multipart/form-data
			httpRequest.setRequestHeader("Content-length", params.length);
			httpRequest.setRequestHeader("Connection", "close");

			httpRequest.send(params);
        }
 }

  
    
    
    
    function processResponse(httpRequest, callBack, loadContents) 
    {
        if (httpRequest.readyState == 4) 
        {
            if (httpRequest.status == 200) 
            {
                theResponse = httpRequest.responseText;
                if (httpRequest.responseText)
                {
                	//alert(httpRequest.responseText);
                	if (loadContents)
                		document.getElementById("dynaScr").innerHTML = httpRequest.responseText;
                	
                	callBack(httpRequest.responseText);
            	}
            } 
            else 
            {
                //alert('There was a problem with the request.');
            }
        }
    }
    