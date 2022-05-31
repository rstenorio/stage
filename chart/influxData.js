function getInfluxData() {
    //let id = sessionStorage.getItem("myid");
    let url = "https://influxdb-iot.canavisia.duckdns.org/api/v2/query?org=canavisia";
    let auth = "Token SkJYty60QPpWuAgnSFCyPMQHrvzv_q9ZyvBuTy1nO8DTqtvSxFxz6_8oRms0XmxWvAK9tTqqX-ms2FrdF8aXqQ==";
    let response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Authorization": auth,
        "Accept": "application/csv",
        "Content-Type": "application/vnd.flux",
      },
    });
  
    let dataGrafico = await response.text;
  
    console.log(dataGrafico);
    
  }
  

//result ,table ,_start                        ,_stop                         ,_time                ,_value             ,_field ,_measurement  ,device    ,plant_key ,sid
//       ,0     ,2022-05-24T06:53:30.83134981Z ,2022-05-24T07:53:30.83134981Z ,2022-05-24T06:59:30Z ,502.45299145299145 ,value  ,co2,demo_hass ,demo_hass ,co2_bagno
