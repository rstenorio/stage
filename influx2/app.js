let my_titolo = "";

let my_measurement = [];
let my_time = [];
let my_value = [];
let my_plant_key = [];
let my_sid = [];

function getInflux() {
  const input_tabella = document.querySelector("#tabella").value;
  const input_range = document.querySelector("#range").value;
  const input_measu = document.querySelector("#measure").value;
  
  const x = input_measu == 'temperature' ? 4 : 3 ;

  const input_sid = input_measu.substr(0, x) + "_" + document.querySelector("#sid").value;
  const apiurl = "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
  const auth = "Token S9ZwQl05cEhfE4IRS0DYwacVGL-7KBvbWJ-hCZyXJrLruuPYIRqbHjhlli6nlU-KvxkfsknTkH8RokL9d6kHRw==";

  let query = `from(bucket: "${input_tabella}")
    |> range(start: -${input_range})`;

  if (input_measu == "power") {
    query = query + `|> filter(fn: (r) => r._measurement == "${input_measu}")`;
    my_titolo = input_measu;
  } else {
    my_titolo = input_sid;
    query = query + `|> filter(fn: (r) => r._measurement == "${input_measu}")`;
    query = query + `|> filter(fn: (r) => r.sid == "${input_sid}")`;
  }

  fetch(apiurl, {
    method: "POST",
    headers: {
      Authorization: auth,
      "content-type": "application/vnd.flux",
    },
    body: query,
  })
    .then((response) => {
      //tratare errore di conessione
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
      my_plant_key = plant_key;

      document.getElementById("media").innerHTML = calcmedia(_value).toFixed(2);

      //console.log(parseInt(calcmedia(_value)));
      dummyChart(calcmedia(_value));
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

async function dummyChart(avg) {
  const ctx = document.getElementById("myChart"); //.getContext("2d");
  ctx.style.backgroundColor = "rgba(53, 54, 54)";

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

      horizontalLine: [
        {
          y: avg,
          style: "rgba(60, 179, 113, 0.5)",
        },
      ],

    },
  });
}

var horizonalLinePlugin = {
  afterDraw: function (chartInstance) {
    var yScale = chartInstance.scales["y-axis-0"];
    var canvas = chartInstance.chart;
    var ctx = canvas.ctx;
    var index;
    var line;
    var style;

    if (chartInstance.options.horizontalLine) {
      for (
        index = 0;
        index < chartInstance.options.horizontalLine.length;
        index++
      ) {
        line = chartInstance.options.horizontalLine[index];

        if (!line.style) {
          style = "rgba(169,169,169, .6)";
        } else {
          style = line.style;
        }

        let yValue = 0;

        if (line.y) {
          yValue = yScale.getPixelForValue(line.y);
        } else {
          yValue = 0;
        }

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
Chart.pluginService.register(horizonalLinePlugin);

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
