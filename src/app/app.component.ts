import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Hawk from 'hawk';
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private translate: TranslateService, private http: Http) {
        translate.addLangs(['en', 'fr', 'ur', 'es', 'fa']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|ur|es|fa/) ? browserLang : 'en');
        console.log('Hawk :', Hawk);
    }
}
