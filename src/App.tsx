import { useEffect, useState } from "react";

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export default function App() {
  const [data, setData] = useState<WeatherData | null>(null);

  async function getData(lat: number, long: number) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=6500e2a830519f05180b0a123d48be04`);
    return res.json();
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        getData(position.coords.latitude, position.coords.longitude).then((res) => {
          return setData(res);
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <main className="h-screen w-screen flex justify-center items-center bg-[url(./assets/background.jpg)] bg-cover p-2">
      <div className="max-w-5xl bg-[#f2cecfb5] p-4 rounded-xl flex flex-col text-center items-center gap-6">
        {data ? (
          <>
            <h1 className="text-4xl font-bold tracking-wide">Current Weather</h1>
            <div className="flex gap-4 items-center flex-wrap justify-center">
              <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} alt={data.weather[0].main} className="" />
              <div className="text-2xl font-semibold">
                <h2>{data.weather[0].main}</h2>
                <h3 className="text-gray-700 font-medium capitalize">{data.weather[0].description}</h3>
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-700">{(data.main.temp - 273).toFixed(2)}&deg;C</div>
            <div className="self-stretch flex justify-around gap-6 flex-wrap text-lg font-medium py-6">
              <div className="w-60">
                <p>Humidity</p>
                <p className="text-gray-700">{data.main.humidity}%</p>
              </div>

              <div className="w-60">
                <p>Wind Speed</p>
                <p className="text-gray-700">{data.wind.speed} meter/second</p>
              </div>

              <div className="w-60">
                <p>Wind Direction</p>
                <p className="text-gray-700">{data.wind.deg}&deg;</p>
              </div>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}
