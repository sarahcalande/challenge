// Read CSV file using window.FileOpener/FileReader
// Tested POST and GET with postman
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNWFmZTg0YWViNTY1MDA4ZTgzOWY0MSIsInVzZXIiOiI1YzVhZmU4NGI4NTMyYzAwMTkxYzI4NmYiLCJvcmciOiI1YzVhMDYxMjJlYWM4ODAwMTlmMmU0MTkiLCJvcmdOYW1lIjoienp6LXNhcmFoIiwidXNlclR5cGUiOiJtYWNoaW5lIiwicm9sZXMiOlsib3JnLmFkbWluIiwib3JnLnVzZXIiXSwiZXhwIjoxNTUwMDcyMDY3LCJhdWQiOiJ1cm46Y29uc3VtZXIiLCJpc3MiOiJ1cm46YXBpIiwic3ViIjoiNWM1YWZlODRiODUzMmMwMDE5MWMyODZmIn0.7JtzujViP56W-Vv6e7W4Agb30Txg4WrASeaCXDs_eYk"

//from FileOpener/FileReader documentation
function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

//function puts a file reader in browser window
function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8
	reader.readAsText(fileToRead);
}

function loadHandler(e) {
	var csv = e.target.result;
	processData(csv);
}

//format CSV rows to arrays and splits with commas
function processData(csv) {
  var allTextLines = csv.split(/\r\n|\n/);
  var lines = [];
  while (allTextLines.length) {
    lines.push(allTextLines.shift().split(','));
  }
  parseInfo(lines);
}

//for each array/row, identify indices to make into data objects
//With console.log of lines, I can see all First names were 0 index, etc.
function parseInfo(lines){
for (i = 0; i < lines.length; i++){
  //The customer in row 20 had a Jr. at the end of his name which was adding an extra column,
  //so his indices were off by one.
  if (i !== 19){
    let firstName = (lines[i][0]);
    let lastName = (lines[i][1]);
    //some emails had weird formatting with these characters included. I also put
    //all emails to lowercase because postman showed that as the format in the GET/POST requests
    let email = (lines[i][2]).toLowerCase().replace('%3c','').replace('&gt;','');
    //birthday only accepted in Date format
    let birthday = new Date(lines[i][3]);
    //phones formatted with +1xxxxxxxxxx
    let homePhone = '+1' + (lines[i][4]).split('').map(n => n.replace('-', '')).join('');
    let workPhone = '+1' + (lines[i][5]).split('').map(n => n.replace('-', '')).join('');
    let customerType = (lines[i][6]);
    createObjects(firstName, lastName, homePhone, email, workPhone, customerType, birthday);
    }
else if (i === 19){
  let firstName = lines[19][0];
  let lastName = lines[19][1]+lines[19][2];
  let email = lines[19][3];
  let birthday = new Date(lines[19][4]);
  let homePhone = '+1' + (lines[19][5]).split('').map(n => n.replace('-', '')).join('');
  let workPhone = '+1' + (lines[19][6]).split('').map(n => n.replace('-', '')).join('');
  let customerType = (lines[19][7]);
  createObjects(firstName, lastName, homePhone, email, workPhone, customerType, birthday);
    }
  }
}

function createObjects(firstName, lastName, homePhone, email, workPhone, customerType, birthday){
  //phones and emails should only be added if they exist
  let phones = [];
  if (homePhone !== '+1'){
    phones.push(
      {
      "phone": homePhone,
        "type": "home"
      },
    )
  }
  if (workPhone !== '+1'){
      phones.push(
      {
        "phone": workPhone,
        "type": "work"
      }
    )
  }
  let emails = [];
  if (email !== ""){
    emails.push(
      {
      "email": email,
      "type": "home"
      }
    )
  }


  postRequest(firstName, lastName, emails, phones, birthday, customerType);
}

function postRequest(firstName, lastName, emails, phones, birthday, customerType){
  let sendData = JSON.stringify({
    "name": `${firstName} ${lastName}`,
    "emails": emails,
    "phones": phones,
    "urls": [
      {
        "url": "https://kustomer.com"
      }
    ],
    "locations": [
      {
        "type": "work",
        "address": "530 7th Ave, New York, NY 10018"
      }
    ],
    "locale": "en_US",
    //birthdayAt shown in postman response
      "birthdayAt": birthday,
      //tags shown in postman response
    "tags": [
      "cool customer",
      "nice",
      `this customer is a ${customerType}`
    ],
  })

// MAKE POST REQUEST (derived from Kustomer Docs, normal Kustomer Docs request
// was not working because of CORS.):
  var xhr = new XMLHttpRequest();
  //CORS would not allow POST request with xhr.withCredentials set to true.
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
    }
  });
  // POST Request also did not work to the normal URL so I implemented CORS anywhere to bypass CORS.
  xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://api.kustomerapp.com/v1/customers");
  xhr.setRequestHeader("authorization", `Bearer ${token}`);
  xhr.setRequestHeader("content-type", "application/json");
  xhr.send(sendData);
}

//error handler from FileOpener/FileReader documentation
function errorHandler(e) {
	if(e.target.error.name == "NotReadableError") {
		alert("Cannot read file !");
	}
}
