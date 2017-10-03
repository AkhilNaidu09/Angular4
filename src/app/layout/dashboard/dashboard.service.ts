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
    renderGaugeChart(id, gaugeOptions, color) {

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
                    .attr('width', that.clipWidth - 50)
                    .attr('height', (that.clipWidth - 50) / 2)

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
                        //return config.sectorColorFn(d * i);
                        return that.sectorColorFn(that.ticks[i + 1]);//fill in all the colors in the dial section
                    })
                    .attr('d', arc)
                    .style('stroke', color);

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
                    .attr('transform', 'rotate(' + that.minAngle + ')')
                    .on("mouseover", function(d,i) {
                        d3.select(this).transition()
                            .ease("elastic")
                            .duration("500")
                            .attr("r", 35);
                        d3.select("#clipCircle"+i+" circle").transition()
                            .ease("cubic-out")
                            .duration("200")
                            .attr("r", 32);
                        d3.select("#text"+i).transition()
                            .ease("cubic-out")
                            .duration("200")
                            .attr("y", 12)
                            .attr("font-size", 32)
                            .attr("fill", "#333");
                    })
                    .on("mouseout", function(d,i) {
                        d3.select(this).transition()
                            .ease("quad")
                            .delay("100")
                            .duration("200")
                            .attr("r", 20);
                        d3.select("#clipCircle"+i+" circle").transition()
                            .ease("quad")
                            .delay("100")
                            .duration("200")
                            .attr("r", 0);
                        d3.select("#text"+i).transition()
                            .ease("cubic-out")
                            .duration("400")
                            .delay("100")
                            .attr("y", 7)
                            .attr("font-size", 20)
                            .attr("fill", "#FFF");;
                    } );

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

    config = {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };

    loadLiquidFillGauge(elementId, value, config): void {
        if (config == null) config = this.config;

        let gauge = d3.select("#" + elementId);
        let radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
        let locationX = parseInt(gauge.style("width")) / 2 - radius;
        let locationY = parseInt(gauge.style("height")) / 2 - radius;
        let fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

        let waveHeightScale;
        if (config.waveHeightScaling) {
            waveHeightScale = d3.scaleLinear()
                .range([0, config.waveHeight, 0])
                .domain([0, 50, 100]);
        } else {
            waveHeightScale = d3.scaleLinear()
                .range([config.waveHeight, config.waveHeight])
                .domain([0, 100]);
        }

        let textPixels = (config.textSize * radius / 2);
        let textFinalValue = parseFloat(value).toFixed(2);
        let textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
        let percentText = config.displayPercent ? "%" : "";
        let circleThickness = config.circleThickness * radius;
        let circleFillGap = config.circleFillGap * radius;
        let fillCircleMargin = circleThickness + circleFillGap;
        let fillCircleRadius = radius - fillCircleMargin;
        let waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

        let waveLength = fillCircleRadius * 2 / config.waveCount;
        let waveClipCount = 1 + config.waveCount;
        let waveClipWidth = waveLength * waveClipCount;

        // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
        let textRounder: any = function (value) {
            return Math.round(value);
        };
        if (parseFloat(textFinalValue) != (textRounder(textFinalValue))) {
            textRounder = function (value) {
                return parseFloat(value).toFixed(1);
            };
        }
        if (parseFloat(textFinalValue) != (textRounder(textFinalValue))) {
            textRounder = function (value) {
                return parseFloat(value).toFixed(2);
            };
        }

        // Data for building the clip wave area.
        let data = [];
        for (let i = 0; i <= 40 * waveClipCount; i++) {
            data.push({
                x: i / (40 * waveClipCount),
                y: (i / (40))
            });
        }

        // Scales for drawing the outer circle.
        let gaugeCircleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
        let gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

        // Scales for controlling the size of the clipping path.
        let waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
        let waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

        // Scales for controlling the position of the clipping path.
        let waveRiseScale = d3.scaleLinear()
            // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
            // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
            // circle at 100%.
            .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
            .domain([0, 1]);
        let waveAnimateScale = d3.scaleLinear()
            .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
            .domain([0, 1]);

        // Scale for controlling the position of the text within the gauge.
        let textRiseScaleY = d3.scaleLinear()
            .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
            .domain([0, 1]);

        // Center the gauge within the parent SVG.
        let gaugeGroup = gauge.append("g")
            .attr('transform', 'translate(' + 50 + ',' + locationY + ')');

        // Draw the outer circle.
        let gaugeCircleArc = d3.arc()
            .startAngle(gaugeCircleX(0))
            .endAngle(gaugeCircleX(1))
            .outerRadius(gaugeCircleY(radius))
            .innerRadius(gaugeCircleY(radius - circleThickness));
        gaugeGroup.append("path")
            .attr("d", gaugeCircleArc)
            .style("fill", config.circleColor)
            .attr('transform', 'translate(' + radius + ',' + radius + ')');

        // Text where the wave does not overlap.
        let text1 = gaugeGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.textColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

        // The clipping wave area.
        let clipArea = d3.area()
            .x(<any>function (d) {
                return waveScaleX(d.x);
            })
            .y0(<any>function (d) {
                return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
            })
            .y1(function (d) {
                return (fillCircleRadius * 2 + waveHeight);
            });
        let waveGroup = gaugeGroup.append("defs")
            .append("clipPath")
            .attr("id", "clipWave" + elementId);
        let wave = waveGroup.append("path")
            .datum(data)
            .attr("d", clipArea)
            .attr("T", 0);

        // The inner circle with the clipping wave attached.
        let fillCircleGroup = gaugeGroup.append("g")
            .attr("clip-path", "url(#clipWave" + elementId + ")");
        fillCircleGroup.append("circle")
            .attr("cx", radius)
            .attr("cy", radius)
            .attr("r", fillCircleRadius)
            .style("fill", config.waveColor);

        // Text where the wave does overlap.
        let text2 = fillCircleGroup.append("text")
            .text(textRounder(textStartValue) + percentText)
            .attr("class", "liquidFillGaugeText")
            .attr("text-anchor", "middle")
            .attr("font-size", textPixels + "px")
            .style("fill", config.waveTextColor)
            .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

        // Make the value count up.
        if (config.valueCountUp) {
            let textTween = function () {
                let i = d3.interpolate(this.textContent, textFinalValue);
                let temp = this;
                return function (t) {
                    temp.textContent = textRounder(i(t)) + percentText;
                }
            };
            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
        }

        // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
        let waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
        if (config.waveRise) {
            waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
                .transition()
                .duration(config.waveRiseTime)
                .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
                .on("start", function () {
                    wave.attr('transform', 'translate(1,0)');
                }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
        } else {
            waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
        }

        if (config.waveAnimate) animateWave();

        function animateWave() {
            wave.attr('transform', 'translate(' + waveAnimateScale(+wave.attr('T')) + ',0)');
            wave.transition()
                .duration(config.waveAnimateTime * (1 - +wave.attr('T')))
                .ease(d3.easeLinear)
                .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                .attr('T', 1)
                .on('end', function () {
                    wave.attr('T', 0);
                    animateWave();
                });
        }
    }

}

