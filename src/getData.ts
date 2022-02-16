import axios from 'axios'
import https from 'https'

export default function GetData(){
    // desde la url https://www.minsal.cl/calendario-de-vacunacion-masiva-contra-covid-19/ obtener la informacion de la vacuna
    const URL_VACUNATION_CALENDAR: string = "https://www.minsal.cl/calendario-de-vacunacion-masiva-contra-covid-19";
    console.log('Obteniendo informacion de calendario de vacunas');

    const AxiosInstance = axios.create({httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })}); // Create a new Axios Instance

// Send an async HTTP Get request to the url
AxiosInstance.get(URL_VACUNATION_CALENDAR)
  .then( // Once we have data returned ...
    response => {
      const html = response.data; // Get the HTML from the HTTP request
      console.log(html);
    }
  )
  .catch((err)=>{
      console.log("Error");
    console.log(err)}); // Error handling
}