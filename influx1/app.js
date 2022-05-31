let my_titolo = "";

let my_measurement = [];
let my_time = [];
let my_value = [];
let my_plant_key = [];
let my_sid = [];

//let my_dataset = [];
function getInflux() {
  const input_measu = document.querySelector("#measure").value;
  const input_sid =
    input_measu.substr(0, 3) + "_" + document.querySelector("#sid").value;

  const apiurl =
    "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
  const auth =
    "Token S9ZwQl05cEhfE4IRS0DYwacVGL-7KBvbWJ-hCZyXJrLruuPYIRqbHjhlli6nlU-KvxkfsknTkH8RokL9d6kHRw==";

  let query = `from(bucket: "log")
    |> range(start: -3h)`;

  if (input_measu == "power"){
    query = query + `|> filter(fn: (r) => r._measurement == "${input_measu}")`;
    my_titolo = input_measu;
  }
  else {
    my_titolo = input_sid;
    query = query + `|> filter(fn: (r) => r._measurement == "${input_measu}")`;
    query = query + `|> filter(fn: (r) => r.sid == "${input_sid}")`;
  }

  /**
  |> filter(fn: (r) => r["_measurement"] == "co2")
  |> filter(fn: (r) => r["sid"] == "co2_bagno") */

  fetch(apiurl, {
    method: "POST",
    headers: {
      Authorization: auth,
      "content-type": "application/vnd.flux",
    },
    body: query,
  })
    .then((response) => {
      return response.text();
    })
    .then((result) => {
      const csv = result;
      const myJson = JSON.parse(csvJSON(csv));

      const _measurement = myJson.map((x) => x._measurement);
      const _time = myJson.map((x) => x._time);
      const _value = myJson.map((x) => x._value);
      const plant_key = myJson.map((x) => x.plant_key);
      const sid = myJson.map((x) => x.sid);

      my_sid = sid;
      my_measurement = _measurement;
      my_time = getOre(_time);
      my_giorno = _time[0].substr(0, 10);
      my_value = _value;
      my_plant_key = plant_key



      dummyChart();
    })
    .catch((e) => console.log("ERROR: " + e));
}

function getOre(value) {
  const element = [];
  for (let i = 0; i < value.length; i++) {
    element[i] = value[i].substr(11, 5);
  }
  return element;
}

function calcmedia(value){
  let res = "";
  for (let i = 0; i < value.length; i++) {
    res =+ value[i]; 
  }
  return res / value.length
}

//var csv is the CSV file with headers
function csvJSON(csv) {
  let lines = csv.toString().split("\r\n");
  let result = [];
  let headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;

    let obj = {};
    let currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

async function dummyChart() {
  const ctx = document.getElementById("myChart"); //.getContext("2d");
  ctx.style.backgroundColor = "#E3FDD7"; //'rgba(255,0,0,255)';
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: my_time,
      datasets: [
        {
          label: my_titolo,
          data: my_value,
          backgroundColor: colorArray[searchColor(my_titolo)],
          borderColor: colorArray[searchColor(my_titolo)],
          pointRadius: 0.5,
        },
      ],
    },
    options: {
      elements: {
        line: {
          tension: 0,
          fill: false,
          borderWidth: 2,
        },
      },
    },
  });
}

function searchColor(value) {
  switch (value.substr(4)) {
    case "uff_tecnico":
      return 1;
      break;
    case "commerciale":
      return 2;
      break;
    case "direzione":
      return 3;
      break;
    case "bagno":
      return 4;
      break;
    default:
      return 0;
      break;
  }
}

let colorArray = [
  "rgb(0, 0, 0)",
  "rgb(228, 39, 70)",
  "rgb(106, 90, 205)",
  "rgb(220, 77, 205)",
  "rgb(60, 179, 113)",
  "rgb(0, 160, 239)",
];

/*
1-uff_tecnico
2-commerciale
3-direzione
4-bagno
*/
//getInflux();
