// Plotly Homework
// Terrence Cummings


d3.json("samples.json").then((data) => {
    let sortedSamples = data.samples.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    let sortedMetaData = data.metadata.sort((a, b) => a.id - b.id);
    // sortedMetaData.forEach(addSamples);

    for (let i = 0; i < sortedMetaData.length; i++) {
        sortedMetaData[i].testData = [];
        for (let j = 0; j < sortedSamples[i].otu_ids.length; j++) {
            sortedMetaData[i].testData[j] = {
                'otuID': sortedSamples[i].otu_ids[j],
                'otuLabel': sortedSamples[i].otu_labels[j],
                'sampleValue': sortedSamples[i].sample_values[j]
            };
        };
    };
    console.log(sortedMetaData);

    let patientZero = sortedMetaData[0];
    console.log(patientZero);
    let sortedTestData = patientZero.testData.sort((a, b) => b.sampleValue - a.sampleValue);
    console.log(sortedTestData);
    let topTenTestData = sortedTestData.slice(0, 10).reverse();
    console.log(topTenTestData);

    // Trace1 for the Greek Data
    let trace1 = {
        x: topTenTestData.map(object => object.sampleValue),
        y: topTenTestData.map(object => "OTU " + object.otuID),
        text: topTenTestData.map(object => object.otuLabel),
        name: "Belly Button",
        type: "bar",
        orientation: "h"
    };

    // data
    let data1 = [trace1];

    // Apply the group bar mode to the layout
    let layout = {
        title: "Belly Button Bacteria Volunteer " + sortedMetaData[0].id,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
        }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", data1, layout);















});

// DAY 3, EXERCISE 5 EXAMPLE BELOW HERE
// function unpack(rows, index) {
//     return rows.map(function(row) {
//         return row[index];
//     });
// }

// function getMonthlyData() {

//     var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
//     d3.json(queryUrl).then(function(data) {
//         var dates = unpack(data.dataset.data, 0);
//         var openPrices = unpack(data.dataset.data, 1);
//         var highPrices = unpack(data.dataset.data, 2);
//         var lowPrices = unpack(data.dataset.data, 3);
//         var closingPrices = unpack(data.dataset.data, 4);
//         var volume = unpack(data.dataset.data, 5);
//         buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
//     });
// }

// function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
//     var table = d3.select("#summary-table");
//     var tbody = table.select("tbody");
//     var trow;
//     for (var i = 0; i < 12; i++) {
//         trow = tbody.append("tr");
//         trow.append("td").text(dates[i]);
//         trow.append("td").text(openPrices[i]);
//         trow.append("td").text(highPrices[i]);
//         trow.append("td").text(lowPrices[i]);
//         trow.append("td").text(closingPrices[i]);
//         trow.append("td").text(volume[i]);
//     }
// }

// function buildPlot() {
//     var url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2017-01-01&end_date=2018-11-22&api_key=${apiKey}`;

//     d3.json(url).then(function(data) {

//         // Grab values from the response json object to build the plots
//         var name = data.dataset.name;
//         var stock = data.dataset.dataset_code;
//         var startDate = data.dataset.start_date;
//         var endDate = data.dataset.end_date;
//         var dates = unpack(data.dataset.data, 0);
//         var openingPrices = unpack(data.dataset.data, 1);
//         var highPrices = unpack(data.dataset.data, 2);
//         var lowPrices = unpack(data.dataset.data, 3);
//         var closingPrices = unpack(data.dataset.data, 4);

//         getMonthlyData();

//         var trace1 = {
//             type: "scatter",
//             mode: "lines",
//             name: name,
//             x: dates,
//             y: closingPrices,
//             line: {
//                 color: "#17BECF"
//             }
//         };

//         // Candlestick Trace
//         var trace2 = {
//             type: "candlestick",
//             x: dates,
//             high: highPrices,
//             low: lowPrices,
//             open: openingPrices,
//             close: closingPrices
//         };

//         var data = [trace1, trace2];

//         var layout = {
//             title: `${stock} closing prices`,
//             xaxis: {
//                 range: [startDate, endDate],
//                 type: "date"
//             },
//             yaxis: {
//                 autorange: true,
//                 type: "linear"
//             },
//             showlegend: false
//         };

//         Plotly.newPlot("plot", data, layout, { responsive: false });

//     });
// }

// buildPlot();