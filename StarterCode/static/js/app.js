// Plotly Homework
// Terrence Cummings

// Get the JSON data
d3.json("samples.json").then((data) => {
    // Prepare to merge the Samples Data with the MetaData
    // Ensure the patient ID in the Sample Data and MetaData line up via sort
    let sortedSamples = data.samples.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    let sortedMetaData = data.metadata.sort((a, b) => a.id - b.id);

    // Add an array of objects regarding each sample for each patient to the patient Metadata
    for (let i = 0; i < sortedMetaData.length; i++) {
        sortedMetaData[i].testData = [];
        for (let j = 0; j < sortedSamples[i].otu_ids.length; j++) {
            // Create an object for each sample containing ID, label, and value
            sortedMetaData[i].testData[j] = {
                'otuID': sortedSamples[i].otu_ids[j],
                'otuLabel': sortedSamples[i].otu_labels[j],
                'sampleValue': sortedSamples[i].sample_values[j]
            };
        };
    };
    console.log(sortedMetaData);

    // Listen for dropdown menu selecting the patient number to chart
    d3.select('#selDataset').on('change', barChart);

    // Update the bar chart and the demographic table with the data of the patient selected
    function barChart() {
        // Get the ID of the individual from the dropdown menu value selected
        let inputID = d3.select('#selDataset').node().value;

        // Find the array index associated with the individual selected
        let index = sortedMetaData.findIndex(p => p.id == inputID);
        console.log(index);


        // Get the demographic data for the individual to display in the table
        let patientZero = sortedMetaData[index];
        let patientID = patientZero.id;
        let patientEthnic = patientZero.ethnicity;
        let patientGender = patientZero.gender;
        let patientAge = patientZero.age;
        let patientLocation = patientZero.location;
        let patientBbtype = patientZero.bbtype;
        let patientWfreq = patientZero.wfreq;
        let patientNumSamp = patientZero.testData.length;

        console.log(patientID);
        console.log(patientEthnic);
        console.log(patientGender);
        console.log(patientAge);
        console.log(patientLocation);
        console.log(patientBbtype);
        console.log(patientWfreq);
        console.log(patientNumSamp);

        // Update the demographic table with the individual's data
        d3.select('#patientID').text('id: ' + patientID);
        d3.select('#ethnicity').text('ethnicity: ' + patientEthnic);
        d3.select('#gender').text('gender: ' + patientGender);
        d3.select('#age').text('age: ' + patientAge);
        d3.select('#location').text('location: ' + patientLocation);
        d3.select('#bbtype').text('bbtype: ' + patientBbtype);
        d3.select('#wfreq').text('wfreq: ' + patientWfreq);
        d3.select('#numsamp').text('samples: ' + patientNumSamp);

        // Sort the sample data of the individual based on descending sample values
        let sortedTestData = patientZero.testData.sort((a, b) => b.sampleValue - a.sampleValue);
        console.log(sortedTestData);

        // Take the top 10 largest sample values. Reverse the order for the horizontal bar chart
        let topTenTestData = sortedTestData.slice(0, 10).reverse();
        console.log(topTenTestData);

        // Set the trace info for the horizontal bar chart
        let trace1 = {
            x: topTenTestData.map(object => object.sampleValue),
            y: topTenTestData.map(object => "OTU " + object.otuID),
            text: topTenTestData.map(object => object.otuLabel),
            name: "Belly Button",
            type: "bar",
            orientation: "h"
        };

        // Convert trace to data
        let data1 = [trace1];

        // Bar chart layout
        let layout1 = {
            title: "Belly Button Bacteria: Subject ID " + sortedMetaData[index].id,
            // margin: {
            //     l: 100,
            //     r: 100,
            //     t: 100,
            //     b: 100
            // }
        };

        // Plot the horizontal bar chart for the selected individual
        Plotly.newPlot("bar", data1, layout1);


        var trace2 = {
            x: sortedTestData.map(object => object.otuID),
            y: sortedTestData.map(object => object.sampleValue),
            text: sortedTestData.map(object => object.otuLabel),
            mode: 'markers',
            marker: {
                color: sortedTestData.map(object => object.otuID),
                colorscale: 'Earth',
                size: sortedTestData.map(object => object.sampleValue)
            }
        };

        var data2 = [trace2];

        var layout2 = {
            title: 'Bubble Chart Hover Text',
            showlegend: false,
            // height: 600,
            // width: 600
        };

        Plotly.newPlot('bubble', data2, layout2);

    };














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