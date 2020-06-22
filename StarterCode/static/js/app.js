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

    for (i = 0; i < sortedMetaData.length; i++) {

        // Get the ID for the individual
        let addID = sortedMetaData[i].id;

        // get reference to select element
        let sel = document.getElementById('selDataset');

        // create new option element
        let opt = document.createElement('option');

        // create text node to add to option element (opt)
        opt.appendChild(document.createTextNode(addID));

        // set value property of opt
        opt.value = addID;

        // add opt to end of select box (sel)
        sel.appendChild(opt);
    };

    // Listen for dropdown menu selecting the patient number to chart
    d3.select('#selDataset').on('change', drawCharts);

    // Update the bar chart and the demographic table with the data of the patient selected
    function drawCharts() {
        // Get the ID of the individual from the dropdown menu value selected
        let inputID = d3.select('#selDataset').node().value;

        // Find the array index associated with the individual selected
        let index = sortedMetaData.findIndex(p => p.id == inputID);

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

        // Take the top 10 largest sample values. Reverse the order for the horizontal bar chart
        let topTenTestData = sortedTestData.slice(0, 10).reverse();

        // Begin barchart
        // Trace for horizontal bar chart
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
            title: "Top 10 Belly Button Bacteria",
        };

        // Plot the horizontal bar chart for the selected individual
        Plotly.newPlot("bar", data1, layout1);

        // Begin bubble chart
        // Trace for bubble chart
        let trace2 = {
            x: sortedTestData.map(object => object.otuID),
            y: sortedTestData.map(object => object.sampleValue),
            text: sortedTestData.map(object => object.otuLabel),
            mode: 'markers',
            marker: {
                color: sortedTestData.map(object => object.otuID),
                colorscale: 'Rainbow',
                size: sortedTestData.map(object => object.sampleValue)
            }
        };

        // Convert trace to data
        let data2 = [trace2];

        // Bubble chart layout
        let layout2 = {
            title: 'Belly Button Bacteria',
            showlegend: false,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "OTU Sample Values" }
        };

        // Plot bubble chart for the individual
        Plotly.newPlot('bubble', data2, layout2);

        // Begin gauge chart
        // Trace for gauge chart
        let traceA = {
            type: "pie",
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100],
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    'rgb(31, 119, 180)', 'rgb(255, 127, 14)',
                    'rgb(44, 160, 44)', 'rgb(214, 39, 40)',
                    'rgb(148, 103, 189)', 'rgb(140, 86, 75)',
                    'rgb(227, 119, 194)', 'rgb(127, 127, 127)',
                    'rgb(188, 189, 34)', "white"
                ],
            },
            hoverinfo: 'skip'
        };

        // Calculate the position of the gauge chart needle
        let degrees = patientWfreq / 9 * 180,
            radius = .35;
        let radians = (180 - degrees) * Math.PI / 180;
        let x = radius * Math.cos(radians) + 0.5;
        let y = radius * Math.sin(radians) + 0.5;

        // Gauge chart layout
        let layoutA = {
            // Design of the gauge needle
            shapes: [{
                    type: 'path',
                    path: 'M .52 .5 L .48 .5 L ' + x + ' ' + y + ' Z',
                    fillcolor: 'red',
                    line: {
                        color: 'red'
                    }
                },
                {
                    type: 'circle',
                    // xref: 'x',
                    // yref: 'y',
                    fillcolor: 'red',
                    x0: .48,
                    y0: .48,
                    x1: .52,
                    y1: .52,
                    line: {
                        color: 'red'
                    }
                }
            ],
            title: 'Belly Button Washing Frequency',
            xaxis: { visible: false, range: [-1, 1] },
            yaxis: { visible: false, range: [-1, 1] }
        };

        // Set data for trace
        let dataA = [traceA];

        // Plot the gauge for the individual
        Plotly.newPlot("gauge", dataA, layoutA, { staticPlot: false });

    };


});