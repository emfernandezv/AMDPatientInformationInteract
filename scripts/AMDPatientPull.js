const endpoint = localStorage.getItem('ApiURL');
var data = '';
 function LookUpPatient(name){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    
    var raw = JSON.stringify({
      "ppmdmsg": {
        "@action": "lookuppatient",
        "@class": "api",
        "@msgtime": "4/1/2021 2:16:55 PM",
        "@exactmatch": "0",
        "@name": ""+name+"",
        "@page": "1",
        "@nocookie": "1",
        "usercontext": ""+token+""
      }
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    var obj;
    var response = fetch(endpoint, requestOptions)
                    .then(response => response.text())
                    .then(result => getData(xml2json.fromStr(result)))
                    .catch(error => console.log('error', error));
    
 }

function getData(res){
  console.log(res);
  document.getElementById("result").style.display = 'grid';
  document.getElementById("PatName").innerText = res.PPMDResults.Results.patientlist.patient["@attributes"].name;
  document.getElementById("PatDOB").innerText = res.PPMDResults.Results.patientlist.patient["@attributes"].dob;
  if (res.PPMDResults.Results.patientlist.patient["@attributes"].gender = "F"){
    document.getElementById("PatGender").innerText = "Female";
  }else{
    document.getElementById("PatGender").innerText = "Male";
  }
  document.getElementById("PatAddress").innerText = res.PPMDResults.Results.patientlist.patient.address["@attributes"].address2;
}

 function APIExecution(){
    var nameSearch = document.getElementById('searchField').value;
    LookUpPatient(nameSearch);
 }
 
//listener to the loginaction button click
document.getElementById('SearchAction').addEventListener("click",APIExecution);