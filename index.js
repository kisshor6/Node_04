const http = require("http");
const fs = require("fs");
const requests = require("requests");

const home = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal)=>{
    let temprature = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273.15).toFixed(2));
    temprature = temprature.replace("{%tempmin%}", (orgVal.main.temp_min - 273.15).toFixed(2));
    temprature = temprature.replace("{%tempmax%}", (orgVal.main.temp_max - 273.15).toFixed(2));
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temprature;
}

const server = http.createServer((req, res)=>{
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=nepalgunj&appid=7547a1c3683a20c002efa813eec16604")

        .on("data", (chunk)=>{
            const objJSON = JSON.parse(chunk);
            const arrObj = [objJSON];
            // console.log(arrObj[0].main.temp);
            const realtimeData = arrObj.map((val)=> replaceVal(home, val)).join("");
            res.write(realtimeData);
        })
        .on("end", (err)=> {
            if(err) return console.log("connection lost due to error", err);
            res.end();
            console.log("ending...");
        })
    }
});
server.listen(8000, "127.0.0.1")