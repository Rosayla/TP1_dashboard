import { fetchWeatherData } from './api.js';

document.addEventListener("DOMContentLoaded", async function () {
    const data = await fetchWeatherData(44.34, 10.99, '92e565ed65c64bfb3c6d617d1e05262e');
    console.log(data); // Exemplo de como usar os dados obtidos da API

    const svg = d3.select("#chart")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("background-color", "#f8f9fa");

    const barWidth = 40;
    const barPadding = 10;

    svg.selectAll("rect")
        .data([10, 20, 30, 40, 50])
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * (barWidth + barPadding))
        .attr("y", d => 400 - d * 5)
        .attr("width", barWidth)
        .attr("height", d => d * 5)
        .attr("fill", "steelblue");

    document.getElementById("saveBtn").addEventListener("click", function () {
        // Lógica para salvar o estado do dashboard
        alert("Dashboard state saved!");
    });

    document.getElementById("refreshBtn").addEventListener("click", function () {
        // Lógica para atualizar os KPIs
        const newData = [20, 30, 40, 50, 60]; // Novos dados para os KPIs

        // Atualizar gráficos existentes
        svg.selectAll("rect")
            .data(newData)
            .transition()
            .duration(1000)
            .attr("y", d => 400 - d * 5)
            .attr("height", d => d * 5);

        // Exemplo de atualização de texto em um KPI
        document.getElementById("kpi1").innerText = "KPI 1: " + newData[0];
    });

    interact('.kpi-item').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "#chart",
                endOnly: true,
            }),
        ],
        listeners: {
            start(event) {
                // Lógica quando inicia o arrasto
                const kpiId = event.target.dataset.kpi;
                console.log("Arrastando o KPI: ", kpiId);
            },
            end(event) {
                // Lógica quando termina o arrasto
                const kpiId = event.target.dataset.kpi;
                console.log("Soltando o KPI: ", kpiId);
                // Adicionar lógica para gerar gráfico e adicionar ao dashboard
            },
        },
    });

    svg.selectAll("rect").on("contextmenu", function (event, d) {
        d3.event.preventDefault();
        d3.select(this).remove();
    });
});


