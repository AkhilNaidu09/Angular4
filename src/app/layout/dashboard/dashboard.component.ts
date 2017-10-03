import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DashboardService } from 'app/layout/dashboard/dashboard.service';
import * as d3 from'd3';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    gaugeOptionsA: { margin: { top: number; left: number; right: number; }; clipWidth: number; clipHeight: number; lowSector: string; midSector: string; highSector: string; value: number; };
    gaugeOptions02: { margin: { top: number; left: number; right: number; }; clipWidth: number; clipHeight: number; lowSector: string; midSector: string; highSector: string; value: number; };
    gaugeOptions: { margin: { top: number; left: number; right: number; }; clipWidth: number; clipHeight: number; lowSector: string; midSector: string; highSector: string; value: number; };
    gauge: (container: any, configuration: any) => any;
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    constructor(private dashboardService: DashboardService) {

    }

    ngOnInit() {
        this.gaugeOptions = {
            margin: { top: 0, left: 0, right: 0 },
            clipWidth: 300,
            clipHeight: 160,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 75,
        };
        this.gaugeOptions02 = {
            margin: { top: 0, left: 0, right: 0 },
            clipWidth: 300,
            clipHeight: 160,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 80,
        };

        this.gaugeOptionsA = {
            margin: { top: 0, left: 0, right: 0 },
            clipWidth: 300,
            clipHeight: 160,
            lowSector: '0,100',//red
            midSector: '42.0,63',//yellow
            highSector: '63,100',//green	
            value: 80,
        };
        
        this.dashboardService.renderGaugeChart('#gauge', this.gaugeOptions, 'yellow');
        this.dashboardService.renderGaugeChart('#gauge02', this.gaugeOptions02, 'green');
        this.dashboardService.loadLiquidFillGauge('chart', 50, null);


        this.dashboardService.renderGaugeChart('#gaugeA', this.gaugeOptionsA, 'yellow');
    }

    


 
    imageUploaded(event) {
        console.log(event);
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
