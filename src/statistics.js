import AbstractSmartComponent from "./components/abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";

const colorToHex = {
  black: `#000000`,
  blue: `#0c5cdd`,
  green: `#31b55c`,
  pink: `#ff3cb9`,
  yellow: `#ffe125`,
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcUniqCountColor = (tasks, color) => {
  return tasks.filter((it) => it.color === color).length;
};


const renderColorsChart = (colorsCtx, tasks) => {
  const colors = tasks
    .map((task) => task.color)
    .filter(getUniqItems);

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: colors,
      datasets: [{
        data: colors.map((color) => calcUniqCountColor(tasks, color)),
        backgroundColor: colors.map((color) => colorToHex[color])
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: COLORS`,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>
          <div class="statistic-input-wrap">
            <input class="statistic__period-input" type="text" placeholder="">
          </div>
          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found"></span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>
      <div class="statistic__circle">
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(tasks) {
    super();

    this._tasks = tasks;

    // this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderCharts() {
    const element = this.getElement();

    const colorsCtx = element.querySelector(`.statistic__colors`);

    this._resetCharts();

    this._colorsChart = renderColorsChart(colorsCtx, this._tasks.getTasks());
  }

  show() {
    super.show();

    this.rerender(this._tasks, this._dateFrom, this._dateTo);
  }

  recoveryListeners() {}

  rerender(tasks) {
    this._tasks = tasks;

    super.rerender();

    this._renderCharts();
  }

  _resetCharts() {
    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }

}
