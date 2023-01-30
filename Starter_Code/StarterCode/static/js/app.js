function init(){

    //init function code
    createDropdown()
}

var selector = d3.select("#selDataset");

function createDropdown(){

    //init function code
    d3.json("samples.json").then((data) => {
        let names = data.names;
    
        names.forEach((name) => {
          selector
            .append("option")
            .text(name)
            .property("value", name);
        });
        
        buildMetadata(names[0]);
        buildCharts(names[0]);
        console.log(names[0])
    });
}

function optionChanged(id){
/*     console.log(optionChanged(id)) */
      buildMetadata(id);
      buildCharts(id);
  
  }

function buildMetadata(id){

    d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
        // console.log(metadata.filter(idObj => idObj.id == id))
        let resultArray = metadata.filter(idObj => idObj.id == id);
        let result = resultArray[0];

        let box = d3.select("#sample-metadata");
        
        box.html("");
        Object.entries(result).forEach(([key, value]) => {
            box.append("h6").text(`${key.toUpperCase()}: ${value}`);
          });
    })

}

function buildCharts(id) {
    d3.json("samples.json").then((data) => {
        let samples = data.samples;
        let resultArray = samples.filter(idObj => idObj.id == id);
        let result = resultArray[0];
        console.log(result)
        let metadata = data.metadata;
        let metaArray = metadata.filter(idObj => idObj.id == id);
        let metaResult = metaArray[0];
        let wfreq = metaResult.wfreq;
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let barData = [
            {
              y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
              x: sample_values.slice(0, 10).reverse(),
              text: otu_labels.slice(0, 10).reverse(),
              type: "bar",
              orientation: "h",
              marker: {
                color: 'C21460'
              }
            }
          ];
          let barLayout = {
            title: "Top 10 Bacterial Cultures Found",
            margin: { t: 30, l: 150 },
          };

          Plotly.newPlot("bar", barData, barLayout);
          let bubbleLayout = {
            title: "Bacterial Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30}
          };
          let bubbleData = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "RdBu"
              }
            }
          ];
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
          let gaugeData = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wfreq,
              title: { text: "# Scrubs Per Week" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 10] },
                bar: { color: "#8B4513" },
                //used html random triadic color scheme https://www.w3schools.com/colors/colors_triadic.asp
                steps: [
                  { range: [0, 2], color: "#F7F0D4" },
                  { range: [2, 4], color: "#FCCB1A" },
                  { range: [4, 6], color: "#347B98" },
                  { range: [6, 8], color: "#C21460" },
                  { range: [8, 10], color: "#092834" }
                ],
              }
            }
          ];
          let gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    })
}

init()