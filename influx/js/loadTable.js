function State() {

    //dati che vieni da csv
    //this.csv = new CSV();

    const startData = [];
    const stopData = [];
    const timeData = [];
    const valueData = [];

}

const state = new State();

export function init() {
    state.listSection = document.querySelector(".form-table");
}

export function addDati(address) {
    const dati = createTable(address);
    state.listSection.appendChild(dati);
}

function createTable(address) {

    const startData = [];
    const stopData = [];
    const timeData = [];
    const valueData = [];

    const div = document.createElement(".form-table");
    div.classList.add("myTable");

    const h3 = document.createElement("h3");
    h3.innerHTML = address.city;

    const line = document.createElement("p");
    line.classList.add("address-line");
    line.innerHTML = `${address.street}, ${address.number}`;

    const cep = document.createElement("p");
    cep.classList.add("address-cep");
    cep.innerHTML = address.cep;

    div.appendChild(h3);
    div.appendChild(line);
    div.appendChild(cep);

    return div;
}


function caricaCSV(){
  
    const uploadconfirm = document
      .getElementById("uploadconfirm")
      .addEventListener("click", () => {
        Papa.parse(document.getElementById("uploadfile").files[0], {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            for (let i = 0; i < results.data.length; i++) {
              //text.substring(1, 4);
              startData.push(results.data[i]._start);
              stopData.push(results.data[i]._stop);
              timeData.push(results.data[i]._time);
              valueData.push(results.data[i]._value);
            }
  
            console.log(startData);
            console.log(stopData);
            console.log(timeData);
            console.log(valueData);
          },
        });
      });
}