import * as requestService from 'request-service.js';
import InfluxDati from 'service.js';

export async function getDati(cep) {
    let start_date = sessionStorage.getItem("input-start");
    let stop_date = sessionStorage.getItem("input-stop");
    let apikey1 = sessionStorage.getItem("input-apikey1");
    let apikey2 = sessionStorage.getItem("input-apikey2");

    const url = "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
    const auth =  "Token SkJYty60QPpWuAgnSFCyPMQHrvzv_q9ZyvBuTy1nO8DTqtvSxFxz6_8oRms0XmxWvAK9tTqqX-ms2FrdF8aXqQ==";
    const query = 'from(bucket: "poste1") ' + 
                     '|> range(start: ' + start_date + ', stop: ' + stop_date + ') ' + 
                     '|> filter(fn: (r) => r._measurement == "S03" and (r.apikey == "' + apikey1 + '" or r.apikey == "' + apikey2 + '"))'

    fetch(url,{
        method:"GET",
        mode: "no-cors",
        headers={
            "Authorization": auth, 
            "Accept": "application/csv", 
            "Content-Type": "application/vnd.flux"},
            data:query
    }).then(ris =>
        console.log(ris.data))
        .then(jsobj => {
            let arbkm = jsobj.data;


            console.log(arbkm);
            let table = "<table>";
            for (bkm of arbkm) {
                let row = "<tr><td>" + bkm[f1] + "</td><td>" + bkm.link + "</td></tr>";
                table += row;
            }
            table += "</table>";
            document.querySelector("#divbkms").innerHTML = table;
        });



    //const result = await requestService.getJson(url);
        //const InfluxDati = await requestService.getDati()
        const influxdb = new InfluxDati()

//    const dati = new Dati(result.cep, result.logradouro, null, result.localidade);





    return influxdb;
}


if apikey2 is not None:
query = 'from(bucket: "poste1") |> range(start: ' + start_date + ', stop: ' + stop_date + ') |> filter(fn: (r) => r._measurement == "S03" and (r.apikey == "' + apikey + '" or r.apikey == "' + apikey2 + '"))'
else:
apikey2 = "invalid"
query = 'from(bucket: "poste1") |> range(start: ' + start_date + ', stop: ' + stop_date + ') |> filter(fn: (r) => r._measurement == "S03" and r.apikey == "' + apikey + '")'

x = requests.post("https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia", 
headers={
"Authorization": auth, 
"Accept": "application/csv", 
"Content-Type": "application/vnd.flux"}, 
data=query)


function getBkms() {
    let id = sessionStorage.getItem("myid");
    let url = "https://bkmapp.tssdev.it/resources/users/" + id + "/bkms";
    let auth = "Bearer " + sessionStorage.getItem("globaljwt");
    const h = new Headers();
    h.append("Accept", 'application/json');
    h.append("Authorization", auth);
    fetch(url, {
            method: "GET",
            mode: "cors",
            headers: h
        })
        .then(ris =>
            ris.json())
        .then(jsobj => {
            let f1 = "description";
            let arbkm = jsobj.data;
            console.log(arbkm);
            let table = "<table>";
            for (bkm of arbkm) {
                let row = "<tr><td>" + bkm[f1] + "</td><td>" + bkm.link + "</td></tr>";
                table += row;
            }
            table += "</table>";
            document.querySelector("#divbkms").innerHTML = table;
        });
}