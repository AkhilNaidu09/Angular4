import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import { Injectable } from '@angular/core';

@Injectable()
export class DashboardService {
    //public renderGaugeChart: () => void;
    gauge: (container: any, configuration: any) => any;
    constructor() {
    }
    renderGaugeChart (id,gaugeOptions, color) {

        this.gauge = function (container, configuration) {
            var that = this;
            that.sectorColorFn = function (tick) {
                var cfg = this;
                var min = cfg.lowSector.split(',')[0];
                var max = cfg.lowSector.split(',')[1];
                if (tick >= min && tick <= max) {
                    return color;//red
                }
                min = cfg.midSector.split(',')[0];
                max = cfg.midSector.split(',')[1];
                if (tick >= min && tick <= max) {
                    return color;//yellow
                }
                min = cfg.highSector.split(',')[0];
                max = cfg.highSector.split(',')[1];
                if (tick >= min && tick <= max) {
                    return color;//green
                }
                return 'none';
            }
            that.setMinMaxValue = function (cfg) {
                var min = parseFloat(cfg.minValue);
                var max = parseFloat(cfg.maxValue);
                var sectors = [parseFloat(cfg.lowSector.split(',')[0]),
                parseFloat(cfg.lowSector.split(',')[1]),
                parseFloat(cfg.midSector.split(',')[0]),
                parseFloat(cfg.midSector.split(',')[1]),
                parseFloat(cfg.highSector.split(',')[0]),
                parseFloat(cfg.highSector.split(',')[1])];
                for (var i = 0; i < sectors.length; i++) {
                    if (sectors[i] <= min) {
                        min = sectors[i];
                    }
                    if (sectors[i] >= max) {
                        max = sectors[i];
                    }
                }
                cfg.minValue = min;
                cfg.maxValue = max;

                cfg.majorTicks = (max - min) / 10;

                return cfg;
            }
            that.getSize = function (height, width) {
                return (height < width) ? height + ((width - height) / 2) : width + ((height - width) / 2);
            }
            var config = {
                /*size						: 200,
                clipWidth					: 200,
                clipHeight					: 110,
                ringWidth					: 20,*/
                size: that.getSize(configuration.clipHeight, configuration.clipWidth),
                clipWidth: configuration.clipWidth,
                clipHeight: configuration.clipHeight,
                ringWidth: configuration.ringWidth,
                ringInset: 20,
                pointerWidth: 10,
                pointerTailLength: 8,
                pointerHeadLengthPercent: 0.6,

                /*minValue					: 0,//grab smallest value from sectors
                maxValue					: 100,//grab largest value from sectors
                lowSector					:'0,30',//red
                midSector					:'30,60',//yellow
                highSector					:'60,100',//green
        */

                margin: configuration.margin,
                minAngle: -90,
                maxAngle: 90,

                transitionMs: configuration.transitionMs || 4000,

                majorTicks: 10,//(max-min) divide by 10

                minValue: 0 || configuration.lowSector.split(',')[0],//grab smallest value from sectors
                maxValue: 100 || configuration.highSector.split(',')[1],//grab largest value from sectors
                lowSector: configuration.lowSector,//red
                midSector: configuration.midSector,//yellow
                highSector: configuration.highSector,//green
                value: configuration.value,

                labelFormat: d3.format(',g'),
                labels: '',
                labelInset: 10,

                sectorColorFn: that.sectorColorFn,
            };

            config = that.setMinMaxValue(config);
            for (let prop in config) {
                that[prop] = config[prop];
            }
            if (configuration.goal) {
                var goal = parseFloat(configuration.goal);
                var upperLowSector = goal - goal * 10 / 100;
                var maxValue = 100;//default 100
                if (upperLowSector > 0 && upperLowSector < 10) {
                    maxValue = 10;
                } else if (upperLowSector > 100 && upperLowSector < 1000) {
                    maxValue = 1000;
                }

                that.lowSector = "0," + upperLowSector;
                that.midSector = upperLowSector + "," + goal;
                that.highSector = goal + "," + maxValue;
            }
            var range = undefined;
            var r = undefined;
            var pointerHeadLength = undefined;
            var value = 0;

            var svg = undefined;
            var arc = undefined;
            var scale = undefined;
            var ticks = undefined;
            var tickValues = undefined;
            var tickData = undefined;
            var pointer = undefined;

            var donut = d3Shape.pie();

            function deg2rad(deg) {
                return deg * Math.PI / 180;
            }

            function newAngle(d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + (ratio * range);
                return newAngle;
            }

            function configure() {

                that.size = that.getSize(that.clipHeight, that.clipWidth);
                that.ringWidth = that.size * 0.2;
                range = that.maxAngle - that.minAngle;
                r = that.size / 2;
                that.pointerHeadLength = Math.round(r * that.pointerHeadLengthPercent);

                // a linear scale that maps domain values to a percent from 0..1
                scale = d3Scale.scaleLinear()
                    .range([0, 1])
                    .domain([that.minValue, that.maxValue]);

                that.ticks = scale.ticks(that.maxValue);
                that.tickValues = scale.ticks(that.majorTicks);
                that.tickData = d3.range(that.maxValue).map(function () { return 1 / that.maxValue; });

                arc = d3Shape.arc()
                    .innerRadius(r - that.ringWidth - that.ringInset)
                    .outerRadius(r - that.ringInset)
                    .startAngle(function (d, i) {
                        var ratio = d * i;
                        return deg2rad(that.minAngle + (ratio * range));
                    })
                    .endAngle(function (d, i) {
                        var ratio = d * (i + 1);
                        return deg2rad(that.minAngle + (ratio * range));
                    });
            }

            function centerTranslation() {
                return 'translate(' + r + ',' + r + ')';
            }

            function isRendered() {
                return (svg !== undefined);
            }
            function update() {
                /*if ( newConfiguration  !== undefined) {
                    configure(newConfiguration);
                }*/
                var ratio = scale(that.value);
                var newAngle = that.minAngle + (ratio * range);
                pointer.transition()
                    .duration(that.transitionMs)
                    .attr('transform', 'rotate(' + newAngle + ')');
            }

            function render() {
                if (d3.select(container).selectAll('.gauge')) {
                    d3.select(container).selectAll('.gauge').remove()
                }
                svg = d3.select(container)
                    .attr('width', that.clipWidth -50)
                    .attr('height', (that.clipWidth - 50)/2)
                    .append('svg:svg')
                    .attr('class', 'gauge')
                    .attr('width', that.clipWidth)
                    .attr('height', that.clipHeight)
                    .attr('x', that.margin.left)
                    .attr('y', that.margin.top);

                var centerTx = centerTranslation();

                var arcs = svg.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                arcs.selectAll('path')
                    .data(that.tickData)//populate the section of the dial
                    .enter().append('path')
                    .attr('fill', function (d, i) {
                        /*return config.arcColorFn(d * i);*/
                        return that.sectorColorFn(that.ticks[i + 1]);//fill in all the colors in the dial section
                    })
                    .attr('d', arc);

                //appending gauge ticks
                var lg = svg.append('g')
                    .attr('class', 'label')
                    .attr('transform', centerTx);
                lg.selectAll('text')
                    .data(that.ticks)
                    .enter().append('text')
                    .attr('transform', function (d) {//this portion rotate and place the ticks at the correct position surrounding the gauge
                        //rotate only the displayed majorTicks
                        var ratio = scale(d);
                        var newAngle = that.minAngle + (ratio * range);
                        return 'rotate(' + newAngle + ') translate(0,' + (that.labelInset - r) + ')';

                    })
                    .text(that.labels);

                //create the gauge needle that point to the value
                var lineData = [[that.pointerWidth / 2, 0],
                [0, -that.pointerHeadLength],
                [-(that.pointerWidth / 2), 0],
                [0, that.pointerTailLength],
                [that.pointerWidth / 2, 0]];
                var pointerLine = d3Shape.line();
                var pg = svg.append('g').data([lineData])
                    .attr('class', 'pointer')
                    .attr('transform', centerTx);

                pointer = pg.append('path')
                    .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
                    .attr('transform', 'rotate(' + that.minAngle + ')');

                update();
            }



            function height(height) {
                that.clipHeight = height;
                that.configure();
                that.render();
            }

            function width(width) {
                that.clipWidth = width;
                that.configure();
                that.render();
            }

            configure();

            that.configure = configure;
            that.isRendered = isRendered;
            that.render = render;
            that.update = update;
            that.height = height;
            that.width = width;
            return that;
        };


        var gaugeChart = this.gauge(id, gaugeOptions);
        gaugeChart.render();
    }
}

