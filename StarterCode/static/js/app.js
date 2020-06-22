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
            title: "Belly Button Bacteria",
            // margin: {
            //     l: 100,
            //     r: 100,
            //     t: 100,
            //     b: 100
            // }
        };

        // Plot the horizontal bar chart for the selected individual
        Plotly.newPlot("bar", data1, layout1);

        // Start bubble chart
        let trace2 = {
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

        let data2 = [trace2];

        let layout2 = {
            title: 'Belly Button Bacteria',
            showlegend: false,
            // height: 600,
            // width: 600
        };

        Plotly.newPlot('bubble', data2, layout2);

        // Start gauge chart

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
                colorscale: 'Earth'
            },
            // labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            hoverinfo: ""
        };

        let degrees = patientWfreq / 9 * 180,
            radius = .5;
        let radians = (180 - degrees) * Math.PI / 180;
        let x = radius * Math.cos(radians) + 0.5;
        let y = radius * Math.sin(radians) + 0.5;

        let layoutA = {
            shapes: [{
                type: 'line',
                x0: 0.5,
                y0: 0.5,
                x1: x,
                y1: y,
                line: {
                    color: 'black',
                    width: 8
                }
            }],
            title: 'Belly Button Washing Frequency',
            xaxis: { visible: false, range: [-1, 1] },
            yaxis: { visible: false, range: [-1, 1] }
        };

        let dataA = [traceA];

        Plotly.newPlot("gauge", dataA, layoutA, { staticPlot: false });




    };














});