let nameData = [];
let ageData = [];
let salaryData = [];

async function dummyChart() {
  await getDummyData();

  const ctx = document.getElementById("myChart").getContext("2d");
  //const labels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: nameData,
      datasets: [
        {
          label: "Salary",
          //data: [12, 19, 3, 5, 2, 3],
          data: salaryData,
          backgroundColor: "rgba(109, 71, 71, 0.5)",
          borderColor: "rgba(109, 71, 71, 1)",
          borderWidth: 1,
        },
        {
          label: "Age",
          //data: [120, 19, 30, 5, 20, 3],
          data: ageData,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      tooltips: {
        mode: "index",
      },
    },
  });
}

//Fetch Daya from dummy REST API

async function getDummyData() {
  const apiUrl = "https://dummy.restapiexample.com/api/v1/employees";
  const response = await fetch(apiUrl);
  const barCharData = await response.json();

  console.log(barCharData);

  const age = barCharData.data.map((x) => x.employee_age);
  const name = barCharData.data.map((x) => x.employee_name);
  const salary = barCharData.data.map((x) => x.employee_salary);

  console.log(age, salary, name);

  ageData = age;
  nameData = name;
  salaryData = salary;
}

dummyChart();
//getDummyData();

