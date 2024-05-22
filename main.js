document.addEventListener("DOMContentLoaded", () => {
    const kpiItems = document.querySelectorAll('.kpi-item');
    const graphContainers = document.querySelectorAll('.graph-container');


    // Função para criar e exibir um KPI
    function createKPI(title, value) {
        const kpi = {
            title: title,
            value: value,
            updateValue: function(newValue) {
                this.value = newValue;
                console.log(`[${this.title}] Novo valor:`, this.value);
            }
        };
        return kpi;
    }

    // Função para buscar dados da API de previsão do tempo para uma localização específica
    async function fetchWeatherData(lat, lon, apiKey) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        return data;
    }

    // Função para buscar dados da API de previsão do tempo para múltiplas localizações
    async function fetchMultiLocationWeatherData(locations, apiKey) {
        const promises = locations.map(async location => {
            const { lat, lon } = location;
            return fetchWeatherData(lat, lon, apiKey);
        });
        return Promise.all(promises);
    }

    // Lista de localizações
    const locations = [
        { lat: 41.6935, lon: -8.8326 }, // Example location 1
        { lat: 40.7128, lon: -74.0060 }, // Example location 2
        { lat: 34.0522, lon: -118.2437 }, // Example location 3
        { lat: 51.5074, lon: -0.1278 }, // Example location 4
        { lat: 48.8566, lon: 2.3522 }, // Example location 5
        { lat: 35.6895, lon: 139.6917 }, // Example location 6
        { lat: -33.8688, lon: 151.2093 }, // Example location 7
        { lat: 55.7558, lon: 37.6176 }, // Example location 8
        { lat: 52.5200, lon: 13.4050 }, // Example location 9
        { lat: -23.5505, lon: -46.6333 }, // Example location 10
        { lat: 28.6139, lon: 77.2090 }, // Example location 11
        { lat: -34.6037, lon: -58.3816 }, // Example location 12
        { lat: 31.2304, lon: 121.4737 }, // Example location 13
        { lat: 30.0444, lon: 31.2357 }, // Example location 14
        { lat: 19.4326, lon: -99.1332 }, // Example location 15
        { lat: 37.7749, lon: -122.4194 }, // Example location 16
        { lat: 1.3521, lon: 103.8198 }, // Example location 17
        { lat: 39.9042, lon: 116.4074 }, // Example location 18
        { lat: 41.9028, lon: 12.4964 }, // Example location 19
        { lat: 13.7563, lon: 100.5018 }, // Example location 20
        { lat: 55.9533, lon: -3.1883 }, // Example location 21
        { lat: 50.1109, lon: 8.6821 }, // Example location 22
        { lat: 35.6762, lon: 139.6503 }, // Example location 23
        { lat: 45.4642, lon: 9.1900 }, // Example location 24
        { lat: 22.3193, lon: 114.1694 }, // Example location 25
        { lat: 43.6511, lon: -79.3470 }, // Example location 26
        { lat: 3.1390, lon: 101.6869 }, // Example location 27
        { lat: 52.3676, lon: 4.9041 }, // Example location 28
        { lat: 50.0755, lon: 14.4378 }, // Example location 29
        { lat: -22.9068, lon: -43.1729 } // Example location 30
    ];
    // Converte de Kelvin para Celsius
    function convertKelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }

        // Função para converter m/s para km/h
    function convertMetersPerSecondToKilometersPerHour(mps) {
        return mps * 3.6;
    }
    
    // Adiciona manipuladores de eventos para os itens KPI
    kpiItems.forEach(item => {
        item.addEventListener('click', async () => {
            const kpiTitle = item.innerText;
            const apiKey = '92e565ed65c64bfb3c6d617d1e05262e';
            
            try {
                // Fetch weather data for multiple locations
                const weatherDataList = await fetchMultiLocationWeatherData(locations, apiKey);
                
                // Process the aggregated weather data
                let kpiValues = [];

                switch (kpiTitle) {
                    case "Temperatura":
                        kpiValues = weatherDataList.map(data => convertKelvinToCelsius(data.main.temp));
                        break;
                    case "Sensação Térmica":
                        kpiValues = weatherDataList.map(data => convertKelvinToCelsius(data.main.feels_like));
                        break;
                    case "Pressão Atmosférica":
                        kpiValues = weatherDataList.map(data => data.main.pressure);// in hPa
                        break;
                    case "Umidade":
                        kpiValues = weatherDataList.map(data => data.main.humidity);// in percentage (%)
                        break;
                    case "Velocidade do Vento":
                        kpiValues = weatherDataList.map(data => convertMetersPerSecondToKilometersPerHour(data.wind.speed)); // Converted to km/h
                        break;
                    case "Probabilidade de Precipitação":
                        kpiValues = weatherDataList.map(data => data.weather[0].description);// Weather description
                        break;
                    case "País":
                        kpiValues = weatherDataList.map(data => data.sys.country); // Country code
                        break;
                    default:
                        kpiValues = 'N/A';
                        break;
                }

                const kpi = createKPI(kpiTitle, kpiValues);
                console.log(`[${kpi.title}] Valor inicial:`, kpi.value);

                // Display the KPI value on the graphs
                graphContainers.forEach((container, index) => {
                    const svg = d3.select(container).select('svg');
                    svg.selectAll('*').remove(); // Clear previous content

                    svg.append('text')
                        .attr('x', '50%')
                        .attr('y', '50%')
                        .attr('text-anchor', 'middle')
                        .attr('alignment-baseline', 'middle')
                        .text(kpiValues[index] || 'N/A');
                });

            } catch (error) {
                console.error('Error fetching weather data:', error);
            }

        });
    });
    // Add event listener for the CLEAR button
    document.getElementById('clearBtn').addEventListener('click', () => {
        graphContainers.forEach(container => {
            const svg = d3.select(container).select('svg');
            svg.selectAll('*').remove(); // Clear all content
        });
    });
});