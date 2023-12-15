const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Use D3 to read in the Json
d3.json(url).then(function(data){
    console.log(data);
});

// initialize the dashboard 
function init() {

    //select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    
    // get sample names from the json
    d3.json(url).then((data) => {
        
        //put the names into a variable
        let names = data.names;
        
        // add the samples to a drop down, then loop
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });
        
        // initial sample from the list 
        let initSample = names[0];
        
        //log the sample in the console
        console.log(initSample);
        
        //build the initial plots on the dashboard
        barChart(initSample);
        bubbleChart(initSample);
        demographics(initSample);
    });
}; 

//Create a horizontal bar char with a dropdown to display the top 10 OTUs found in that individual
//define function for the bar chart
function barChart(sample) {
    //get data from json
    d3.json(url).then((data) => {
        
        //sample data
        let sampleInfo = data.samples; 
        
        //filter based on the samples value
        let values = sampleInfo.filter(result => result.id == sample);
        let valueData = values[0]

        //get values for bar chart
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        
        //log data to console
        console.log(otu_ids,otu_labels,sample_values);

        // set top 10 items to display
        let yvalues = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xvalues = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        //setup trace for bar chart
        let trace1 = {
            x: xvalues,
            y: yvalues, 
            text: labels,
            type: "bar",
            orientation: 'h'
        };

        // setup layout
        let layout = {
            title: "Top 10 OTUs in Sample"
        };

        //Plot in Plotly
        Plotly.newPlot("bar", [trace1], layout);
    });
};

// make a bubble chart for each sample
//define function for the bubble chart
function bubbleChart(sample) {
    
    //get data from json
    d3.json(url).then((data) => {
        
        //sample data
        let sampleInfo = data.samples; 
        
        //filter based on the sample's value
        let values = sampleInfo.filter(result => result.id == sample);
        let valueData = values[0];

        //get values for bubble chart
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values; 

        //log to console
        console.log(otu_ids,otu_labels, sample_values);

        //setup trace for bubble chart
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale:"Portland"
            }
        };
        //setup layout 
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };
        //create plotly plot
        Plotly.newPlot("bubble", [trace2], layout)
    });
};

// display metadata i.e. an individual's demographic information
function demographics(sample) {
    
    //get data from json
    d3.json(url).then((data) => {
        //retrieve metadata
        let metadata = data.metadata;

        //filter based on value of the sample 
        let value =metadata.filter(result => result.id ==sample);
        let valueData = value[0];
        
        //log the value into the console
        console.log(value);

        //clear out metadata currently in the panel
        d3.select('#sample-metadata').html("");

        //add each key and value to the panel using object.entries
        Object.entries(valueData).forEach(([key,value]) => {
            d3.select('#sample-metadata').append('h6').text(`${key}: ${value}`);
        });
    });
};

// update all the plots when a new sample is selected

function optionChanged(value) {
    console.log(value);

    // call all functions
    barChart(value);
    bubbleChart(value);
    demographic(value);
};

//initialize dashboard
init();