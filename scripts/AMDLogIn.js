//Global Variables
var token = '';
var redirectURL = '';
//The advancedMD API Documentation, indicates that in order to log in, the application must be able to handle 2 steps.
//The first step sends the payload to the partnerlogin URL and it will retrieve an error that should be handled
//from that error we must store the webserver value and appent /xmlrpc/processrequest.aspx to the end
//then proceed to resend the payload to get the token.


function LogIn(){
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var officekey = document.getElementById('officekey').value;
  var appname = "TEMP";
  
 // ApiConnect1(username,password,officekey,appname);
 // console.log(redirectURL)
  redirectURL = 'https://api-233.devtest.advancedmd.com/practicemanager/xmlrpc/processrequest.aspx';
  ApiConnect2(username,password,officekey,appname);
};

//Accordig to the documentation it's needed to have a redirect method obtained from first base URL
//from there we need to get the webserver attribute and use it to build a 2nd URL
async function ApiConnect1(user,pass,ok,app){
  var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = "{\r\n \"ppmdmsg\": {\r\n \"@action\": \"login\",\r\n \"@class\": \"login\",\r\n \"@msgtime\": \"04/02/2021 2:07:00 PM\",\r\n        \"@username\": \""+user+"\",\r\n        \"@psw\": \""+pass+"\",\r\n        \"@officecode\": \""+ok+"\",\r\n        \"@appname\": \""+app+"\"\r\n    }\r\n}\r\n\r\n";
    const mainURL = 'https://pm-wfe-241.devtest.advancedmd.com/practicemanager/xmlrpc/processrequest.aspx';
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

    var xml = await fetch(mainURL, requestOptions)
      .then(response => response.text())
      .then(result => RedirectURL(xml2json.fromStr(result)))
      .catch(error => console.log('error', error));

    var text = xml.text();
}
//to create the redirect URL from the response
function RedirectURL(resultJson){
  redirectURL = resultJson.PPMDResults.Results.usercontext["@attributes"].webserver+'/xmlrpc/processrequest.aspx'; 
}

//to execute the 2nd log in attempt with the redirection URL
function ApiConnect2(user,pass,ok,app){
  //console.log(redirectURL)
  var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = "{\r\n \"ppmdmsg\": {\r\n \"@action\": \"login\",\r\n \"@class\": \"login\",\r\n \"@msgtime\": \"04/02/2021 2:07:00 PM\",\r\n        \"@username\": \""+user+"\",\r\n        \"@psw\": \""+pass+"\",\r\n        \"@officecode\": \""+ok+"\",\r\n        \"@appname\": \""+app+"\"\r\n    }\r\n}\r\n\r\n";
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
    
  fetch(redirectURL, requestOptions)
      .then(response => response.text())
      .then(result => GetToken(xml2json.fromStr(result)))
      .catch(error => console.log('error', error));

}
//To get and store the token and redirection URL
function GetToken(resultJson){
  token = resultJson.PPMDResults.Results.usercontext["#text"];
  localStorage.setItem('token', token);
  localStorage.setItem('ApiURL',redirectURL);
  hide();
}

//function to hide the login sections after loggin in.
function hide(){
  window.alert("You have successfully Logged In.");
  document.getElementById('Login-section').style.display = 'none';
  document.getElementById('PatientData-section').style.display = 'grid';
}

//listener to the loginaction button click
document.getElementById('loginAction').addEventListener("click",LogIn);

// creates object instantce of XMLtoJSON
var xml2json = new XMLtoJSON();