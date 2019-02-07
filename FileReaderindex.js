//Read file using Google Docs
// window.FileOpener



const spreadsheet = "https://docs.google.com/spreadsheets/d/1FPYh5c8LY70TlJAS5X2oHASfNWbKPeQEBtTD13y6YEY/edit?ts=58f10dfb#gid=0"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNWFmZTg0YWViNTY1MDA4ZTgzOWY0MSIsInVzZXIiOiI1YzVhZmU4NGI4NTMyYzAwMTkxYzI4NmYiLCJvcmciOiI1YzVhMDYxMjJlYWM4ODAwMTlmMmU0MTkiLCJvcmdOYW1lIjoienp6LXNhcmFoIiwidXNlclR5cGUiOiJtYWNoaW5lIiwicm9sZXMiOlsib3JnLmFkbWluIiwib3JnLnVzZXIiXSwiZXhwIjoxNTUwMDcyMDY3LCJhdWQiOiJ1cm46Y29uc3VtZXIiLCJpc3MiOiJ1cm46YXBpIiwic3ViIjoiNWM1YWZlODRiODUzMmMwMDE5MWMyODZmIn0.7JtzujViP56W-Vv6e7W4Agb30Txg4WrASeaCXDs_eYk"



function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8
	reader.readAsText(fileToRead);
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
      }

var i;
for (i = 0; i < lines.length; i++) {
    const firstName = (lines[i][0])
    const lastName = (lines[i][1])
    const email = (lines[i][2])
    const birthday = (lines[i][3])
    const homePhone = (lines[i][4])
    const workPhone = (lines[i][5])
    const customerType = (lines[i][6])




let sendData = JSON.stringify({
  "name": `${firstName} ${lastName}`,
  "emails": [
    {
      "type": "home",
      "email": email
    }
  ],
  "phones": [
    {
      "type": "work",
      "phone": workPhone
    },
    {
      "type": "home",
      "phone": homePhone
    },
  ],
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
  "tags": [
    customerType
  ],
  "birthday": birthday
})

console.log(sendData)



// MAKE POST REQUEST (from Kustomer Docs):

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://api.kustomerapp.com/v1/customers");
xhr.setRequestHeader("content-type", "application/json")
xhr.setRequestHeader("authorization", `${token}`);

xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
xhr.send(sendData);



}


}








function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}
