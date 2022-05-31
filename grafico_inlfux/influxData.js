async function getInfluxData() {
  let url =
    "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
  let auth =
    "Token S9ZwQl05cEhfE4IRS0DYwacVGL-7KBvbWJ-hCZyXJrLruuPYIRqbHjhlli6nlU-KvxkfsknTkH8RokL9d6kHRw==";
  let data =
    "from(bucket: 'log')|> range(start: -1h)|> filter(fn: (r) => r._measurement == 'co2')";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/vnd.flux",
    },
    body:JSON.stringify(data),
  });

  console.log(response);

  /*
  .then(response => response.json())  // converti a json
  .then(json => console.log(json))    // stampa i dati sulla console
  .catch(err => console.log('Request Failed', err)); // gestisci gli errori
*/
}

async function runInflux() {
  //console.log("runInflux");
  getInfluxData();
}

runInflux();

//result ,table ,_start                        ,_stop                         ,_time                ,_value             ,_field ,_measurement  ,device    ,plant_key ,sid
//       ,0     ,2022-05-24T06:53:30.83134981Z ,2022-05-24T07:53:30.83134981Z ,2022-05-24T06:59:30Z ,502.45299145299145 ,value  ,co2           ,demo_hass ,demo_hass ,co2_bagno
