//var csv is the CSV file with headers
export function csvJSON(csv) {
    console.log('passed here...');
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