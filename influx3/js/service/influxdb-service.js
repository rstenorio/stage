let my_measurement = [];
let my_time = [];
let my_value = [];
let my_plant_key = [];
let my_sid = [];

let start = "";
let end = "";

async function caricaGrafico() {
  start = sistData(localStorage.reservationtime).dtstart;
  end = sistData(localStorage.reservationtime).dtend;
  
  const options = { year: "numeric", month: "long", day: "numeric" };
  const inizio = new Date(start).toLocaleDateString("it", options);
  const finale = new Date(end).toLocaleDateString("it", options);
  document.getElementById("data-cercata").innerHTML = inizio + " e il " + finale;

  //prendere questi valore da .txt
  const measure = ["co2", "humidity", "temperature", "power"];
  const sid = ["bagno", "commerciale", "direzione", "uff_tecnico"];

//  for (let i = 0; i < sid.length; i++) {
    const input_sid = `${measure[0].substring(0, 3)}_${sid[0]}`; //co"_bagno

    const query = [
      `from(bucket: "${localStorage.plant}")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "${measure[0]}")
      |> filter(fn: (r) => r.sid == "${input_sid}")
      |> aggregateWindow(every: ${localStorage.timeframe}, fn: mean, createEmpty: true)`,

      `from(bucket: "${localStorage.plant}")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "${measure[0]}")
      |> filter(fn: (r) => r.sid == "co2_bagno" or r.sid == "co2_commerciale")
      |> aggregateWindow(every: ${localStorage.timeframe}, fn: mean, createEmpty: true)`,
    ];
    getInfluxData(query[1], input_sid);
  //}
}

const sistData = (value) => {
  //21/06/2022 10:23 - 22/06/2022 10:23
  const dtstart = `${value.substr(6, 4)}-${value.substr(3, 2)}-${value.substr(0, 2)}T${value.substr(11, 5)}:00Z`;
  const dtend = `${value.substr(25, 4)}-${value.substr(22, 2)}-${value.substr(19, 2)}T${value.substr(30, 5)}:00Z`;

  return { dtstart, dtend };
};

async function getInfluxData(myquery, input_sid) {
  const apiurl = "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
  const auth = "Token S9ZwQl05cEhfE4IRS0DYwacVGL-7KBvbWJ-hCZyXJrLruuPYIRqbHjhlli6nlU-KvxkfsknTkH8RokL9d6kHRw==";

  await fetch(apiurl, {
    method: "POST",
    headers: {
      Authorization: auth,
      "content-type": "application/vnd.flux",
    },
    body: myquery,
  })
    .then((response) => {
      if (!response.ok) console.log("ERRO");
      return response.text();
    })
    .then((result) => {
      const csv = result;
      const myJson = JSON.parse(csvJSON(csv));

      const _measurement = myJson.map((x) => x._measurement); //co2
      const _time = myJson.map((x) => x._time); //2022-06-21T11:00:00.000Z
      const _value = myJson.map((x) => x._value); //759.76
      const plant_key = myJson.map((x) => x.plant_key); //demo_hass
      const sid = myJson.map((x) => x.sid); //co2_commerciale/co2_bagno

      my_sid = sid;
      my_measurement = _measurement;
      my_time = getOre(_time);
      //my_time = _time;
      my_giorno = _time[0].substr(0, 10);
      my_value = _value;
      my_plant_key = plant_key;

      //invia il valore alla ripporto.html
      //const avg = calcmedia(parseInt(my_value).toPrecision(2));
      const avg = calcmedia(my_value);
      document.getElementById("media").innerHTML = avg;


      //data
      dummyChart(calcmedia(my_value), input_sid, my_value, my_time, my_sid);
      Chart.pluginService.register(horizontalLinePlugin);
    })
    .catch((e) => window.alert("ERROR: " + e));
}

function getOre(value) {
  console.log(value);

  const element = [];
  for (let i = 0; i < value.length; i++) {
    element[i] = value[i].substr(11, 2) + ":00";
  }
  return element;
}

function calcmedia(value) {
  let somma = 0.0;
  for (let i = 0; i < value.length; i++) {
    somma += value[i];
  }
  return parseInt(somma);
  
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

async function dummyChart(avg, titolo, value, time, my_sid) {
  let sidLoop = my_sid[0];
  var valuePrimaLinea = [];
  var valueSecondaLinea = [];
  var titoloPrimaLinea = "";
  var titoloSecondaLinea = "";
  var myTime = [];

  for (let i = 0; i < my_sid.length; i++) {
    if (sidLoop == my_sid[i]) {
      valuePrimaLinea.push(value[i]);
      myTime.push(time[i]);
      titoloPrimaLinea = my_sid[i];
    } else {
      valueSecondaLinea.push(value[i]);
      titoloSecondaLinea = my_sid[i];
    }
  }

  var primaLinea = {
    //label: titolo, //co2_bagno
    //data: value,
    //    backgroundColor: colorArray[searchColor(titolo)],
    //    borderColor: colorArray[searchColor(titolo)],
    label: titoloPrimaLinea, //co2_bagno
    data: valuePrimaLinea,
    backgroundColor: colorArray[searchColor(titoloPrimaLinea)],
    borderColor: colorArray[searchColor(titoloPrimaLinea)],
    pointRadius: 0.5,
  };

  var secondaLinea = {
    label: titoloSecondaLinea, //co2_commerciale
    data: valueSecondaLinea,
    backgroundColor: colorArray[searchColor(titoloSecondaLinea)],
    borderColor: colorArray[searchColor(titoloSecondaLinea)],
    pointRadius: 0.5,
  };

  var mydata = {
    labels: myTime,
    datasets: [primaLinea, secondaLinea],

    //labels : time,
    //datasets:[primaLinea]
  };

  myoptions = {
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
        style: "rgba(60, 79, 113, 0.5)",
      },
    ],
  };

  const ctx = document.getElementById(titolo);
  ctx.style.backgroundColor = "#fff";

  const myChart = new Chart(ctx, {
    type: "line",
    data: mydata,
    options: myoptions,
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
