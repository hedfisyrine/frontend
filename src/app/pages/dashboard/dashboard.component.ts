import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/data.service';
import Chart from 'chart.js';


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  public lineChart: Chart;

  public articles = [];
  public articlesByYear = {};
  public articlesByAuthorsCount = {};
  public articlesByCitationCount: any; // or specify the type of data if possible

  constructor(private dataService: ApiService) {}

  ngOnInit() {
    this.chartColor = "#FFFFFF";
    this.getDataArticles();

  }

  getDataArticles() {
    this.dataService.getArticles().subscribe((data: any) => {
      this.articles = data;
      this.processArticlesData();
      this.processArticlesByAuythor();
      this.init_speed_dashboard();
      this.init_dashboard_Email();

    });
  }

  processArticlesData() {
    this.articles.forEach(article => {
      const year = article.year;
      if (!this.articlesByYear[year]) {
        this.articlesByYear[year] = 0;
      }
      this.articlesByYear[year]++;
      
    });
    

  }
  processArticlesByAuythor() {
    this.articles.forEach(article => {
      const authorsCount = article.author_Id.length;
      if (!this.articlesByAuthorsCount[authorsCount]) {
        this.articlesByAuthorsCount[authorsCount] = 0;
      }
      this.articlesByAuthorsCount[authorsCount]++;
    });
  }


  processArticlesByCitation() {
    // Initialize citation count ranges and their counts
    this.articlesByCitationCount = {
      '0-10 citations': 0,
      '11-20 citations': 0,
      '21-30 citations': 0,
      // Add more ranges as needed
    };

    // Iterate through articles and update counts in articlesByCitations
    this.articles.forEach(article => {
      const citationCount = article.citation; // Assuming citation count is in 'citation' property

      // Determine the range for this citation count
      let range = '';
      if (citationCount >= 0 && citationCount <= 10) {
        range = '0-10 citations';
      } else if (citationCount >= 11 && citationCount <= 20) {
        range = '11-20 citations';
      } else if (citationCount >= 21 && citationCount <= 30) {
        range = '21-30 citations';
      }
      // Add more conditions for other ranges as needed

      // Update the count in articlesByCitations
      this.articlesByCitationCount[range]++;
    });
  }


  init_speed_dashboard()
  {
    const years = Object.keys(this.articlesByYear);
    const counter = Object.values(this.articlesByYear);
    var speedCanvas = document.getElementById("speedChart");

    var dataSecond = {
      data: counter,
      fill: false,
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    var speedData = {
      labels: years,
      datasets: [ dataSecond]
    };

    var chartOptions = {
      legend: {
        display: false,
        position: 'top'
      }
    };

    this.lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: speedData,
      options: chartOptions
    });
  }   






  init_chart_hour() {
    // Step 1: Calculate citation count ranges and count articles in each range
    const citationRanges = {
      "0-10 citations": 0,
      "11-20 citations": 0,
      "21-30 citations": 0,
      "31-40 citations": 0,
      "41-50 citations": 0,
      "51+ citations": 0
    };
  
    // Assuming you have a data structure like articlesByCitationCount
    // where articlesByCitationCount[citation] gives the count of articles with that citation
    for (const citation in this.articlesByCitationCount) {
      const count = this.articlesByCitationCount[citation];
      if (count >= 0 && count <= 10) {
        citationRanges["0-10 citations"] += count;
      } else if (count >= 11 && count <= 20) {
        citationRanges["11-20 citations"] += count;
      } else if (count >= 21 && count <= 30) {
        citationRanges["21-30 citations"] += count;
      } else if (count >= 31 && count <= 40) {
        citationRanges["31-40 citations"] += count;
      } else if (count >= 41 && count <= 50) {
        citationRanges["41-50 citations"] += count;
      } else {
        citationRanges["51+ citations"] += count;
      }
    }
  
    // Step 2: Prepare data for pie chart
    const citationLabels = Object.keys(citationRanges);
    const citationData = Object.values(citationRanges);
  
    // Step 3: Create the pie chart
    this.canvas = document.getElementById("chartHours");
    this.ctx = this.canvas.getContext("2d");
  
    this.chartHours = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: citationLabels,
        datasets: [{
          label: "Articles by Citation Count Range",
          backgroundColor: [
            '#e3e3e3',
            '#4acccd',
            '#fcc468',
            '#ef8157',
            '#36A2EB',
            '#FF6384'
          ],
          data: citationData
        }]
      },
      options: {
        legend: {
          display: true,
          position: 'right'
        },
        pieceLabel: {
          render: 'percentage',
          fontColor: 'white',
          precision: 2
        },
        tooltips: {
          enabled: true
        },
      }
    });
  }
  
     
   
    init_dashboard_Email() {
      const authorsCounts = Object.keys(this.articlesByAuthorsCount);
      const counts = Object.values(this.articlesByAuthorsCount);
    
      // Get the canvas and context
      this.canvas = document.getElementById("chartEmail");
      this.ctx = this.canvas.getContext("2d");
    
      // Initialize the pie chart
      this.chartEmail = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: authorsCounts,
          datasets: [{
            label: "Articles",
            backgroundColor: [
              '#e3e3e3',
              '#4acccd',
              '#fcc468',
              '#ef8157',
              '#cf8227'
            ],
            data: counts
          }]
        },
        options: {
          legend: {
            display: true, // Display the legend
            position: 'right', // Position the legend to the right
          },
          pieceLabel: {
            render: 'percentage',
            fontColor: 'white',
            precision: 2
          },
          tooltips: {
            enabled: true // Enable tooltips to display data on hover
          },
        }
      });
    }
    




    }





  