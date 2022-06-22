let my_titolo = "";
let my_measurement = [];
let my_time = [];
let my_value = [];
let my_plant_key = [];
let my_sid = [];

const sid = ["bagno", "commerciale", "direzione", "uff_tecnico"];
const measure = ["co2", "humidity", "temperature", "power"];

var start = "";
var end = "";

async function caricaGrafico() {
  const input_sid = measure[0] + "_" + sid[0];

  const input_range = localStorage.reservationtime;

  start = `${input_range.substr(6, 4)}-${input_range.substr(3,2)}-${input_range.substr(0, 2)}T00:00:00Z`; //
  end = `${input_range.substr(25, 4)}-${input_range.substr(22,2)}-${input_range.substr(19, 2)}T00:00:00Z`; //

  const query = [
    `from(bucket: "${localStorage.plant}")
         |> range(start: ${start}, stop: ${end})
         |> filter(fn: (r) => r._measurement == "${measure[0]}")
         |> filter(fn: (r) => r.sid == "${input_sid}")
         |> aggregateWindow(every: ${localStorage.timeframe}, fn: mean, createEmpty: true)`,
        ];

  getInfluxData(query[0],input_sid);
  //getInfluxData(0);

  /*
  const myPromise = new Promise((resolve, reject)=>{

    setTimeout(() => {
      for (let i = 0; i < sid.length; i++) {
        //getInfluxData(1);
        resolve(getInfluxData(i));
      }
    }, 2000);

  });
*/
}

async function getInfluxData(myquery,input_sid) {
//async function getInfluxData(value) {
  /*
  const input_plant = localStorage.plant;
  const input_range = localStorage.reservationtime;
  const input_select_timeframe = localStorage.timeframe;
  
  //  let start = input_range.substr(6, 4) + "-" + input_range.substr(3, 2) + "-" + input_range.substr(0, 2) + "T00:00:00Z";
  //  let end = input_range.substr(25, 4) + "-" + input_range.substr(22, 2) + "-" + input_range.substr(19, 2) + "T00:00:00Z";
  //20/06/2022 12:17 - 21/06/2022 12:17
  
  const input_range = localStorage.reservationtime;
  
  const input_measu = measure[value]; //document.querySelector("#measure").value;
  const x = input_measu == "temperature" ? 4 : 3;
  const input_sid = input_measu.substr(0, x) + "_" + sid[value]; //document.querySelector("#sid").value;

  //${input_range.substr(11, 5)}
  //${input_range.substr(30, 5)}

  let start = `${input_range.substr(6, 4)}-${input_range.substr(3,2)}-${input_range.substr(0, 2)}T00:00:00Z`;
  let end = `${input_range.substr(25, 4)}-${input_range.substr(22,2)}-${input_range.substr(19, 2)}T00:00:00Z`;

  const query = [
    `from(bucket: "${localStorage.plant}")
    |> range(start: ${start}, stop: ${end})
    |> filter(fn: (r) => r._measurement == "${measure[value]}")
    |> filter(fn: (r) => r.sid == "${input_sid}")
    |> aggregateWindow(every: ${localStorage.timeframe}, fn: mean, createEmpty: true)`,
  ];
  */
  
  const apiurl = "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
  const auth = "Token S9ZwQl05cEhfE4IRS0DYwacVGL-7KBvbWJ-hCZyXJrLruuPYIRqbHjhlli6nlU-KvxkfsknTkH8RokL9d6kHRw==";

  my_titolo = input_sid;

  await fetch(apiurl, {
    method: "POST",
    headers: {
      Authorization: auth,
      "content-type": "application/vnd.flux",
    },
    body: myquery,
  })
    .then((response) => {
      if (!response.ok)
        console.log("ERRO");

      return response.text();
    })
    .then((result) => {
      const csv = result;
      const myJson = JSON.parse(csvJSON(csv));

      const _measurement = myJson.map((x) => x._measurement);
      const _time = myJson.map((x) => x._time);
      const _value = myJson.map((x) => x._value);
      const plant_key = myJson.map((x) => x.plant_key);
      //const sid = myJson.map((x) => x.sid);

      //my_sid = sid;
      my_measurement = _measurement;
      my_time = getOre(_time);
      //my_time = _time;
      my_giorno = _time[0].substr(0, 10);
      my_value = _value;
      my_plant_key = plant_key;

      //invia il valore alla ripporto.html
      document.getElementById("media").innerHTML = calcmedia(my_value).toFixed(2);

      const options = { year: "numeric", month: "long", day: "numeric" };
      start = new Date(start).toLocaleDateString("it", options);
      end = new Date(end).toLocaleDateString("it", options);

      document.getElementById("data-cercata").innerHTML = start + " e il " + end;

      //data
      dummyChart(calcmedia(my_value), my_titolo, my_value, my_time);
      Chart.pluginService.register(horizontalLinePlugin);
    })
    .catch((e) => window.alert("ERROR: " + e));
}

function getOre(value) {
  const element = [];
  for (let i = 0; i < value.length; i++) {
    element[i] = value[i].substr(11, 2) + ":00";
    i++;
  }
  return element;
}

function calcmedia(value) {
  let res = 0.0;
  for (let i = 0; i < value.length; i++) {
    res += parseFloat(value[i]);
  }
  return res / value.length;
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

async function dummyChart(avg, titolo, value, time) {
  const ctx = document.getElementById(titolo);
  ctx.style.backgroundColor = "rgba(53, 54, 54)";

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: time,
      datasets: [
        {
          label: titolo,
          data: value,
          backgroundColor: colorArray[searchColor(titolo)],
          borderColor: colorArray[searchColor(titolo)],
          pointRadius: 0,
        },
      ],
    },
    options: {
      elements: {
        line: {
          tension: 0,
          fill: false,
          borderWidth: 1.5,
        },
      },
      horizontalLine: [
        {
          y: avg,
          style: "rgba(60, 179, 113, 0.5)",
        },
      ],
    },
  });
}

function searchColor(value) {
  switch (value.substr(4)) {
    case "uff_tecnico":
      return 1;
    //break;
    case "commerciale":
      return 2;
    //break;
    case "direzione":
      return 3;
    //break;
    case "bagno":
      return 4;
    //break;
    default:
      return 0;
    //break;
  }
}

let colorArray = [
  "rgb(255, 255, 255)",
  "rgb(228, 39, 70)",
  "rgb(106, 90, 205)",
  "rgb(220, 77, 205)",
  "rgb(60, 179, 113)",
  "rgb(0, 160, 239)",
];

let horizontalLinePlugin = {
  afterDraw: function (chartInstance) {
    let yScale = chartInstance.scales["y-axis-0"];
    let canvas = chartInstance.chart;
    let ctx = canvas.ctx;
    let index;
    let line;
    let style;
    let yValue;

    if (chartInstance.options.horizontalLine) {
      for (
        index = 0;
        index < chartInstance.options.horizontalLine.length;
        index++
      ) {
        line = chartInstance.options.horizontalLine[index];
        style = !line.style ? "rgba(169,169,169, .6)" : line.style;
        yValue = line.y ? yScale.getPixelForValue(line.y) : 0;

        ctx.lineWidth = 1.5;

        if (yValue) {
          ctx.beginPath();
          ctx.moveTo(0, yValue);
          ctx.lineTo(canvas.width, yValue);
          ctx.strokeStyle = style;
          ctx.stroke();
        }

        if (line.text) {
          ctx.fillStyle = style;
          ctx.fillText(line.text, 0, yValue + ctx.lineWidth);
        }
      }
      return;
    }
  },
};
