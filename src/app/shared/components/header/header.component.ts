import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(private translate: TranslateService, public router: Router) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() { }

    smallMenu() {
        const dom: any = document.getElementsByClassName('navbar-brand');
        const dom2: any = document.querySelectorAll('#sidebar span.sideMenuItemsList');
        const navSize: any = document.getElementById('sidebar');
        const mainContaniner: any = document.getElementsByClassName('main-container');
        console.log(mainContaniner);
        if (dom[0].classList.contains('myPush')) {
            dom[0].classList.remove('myPush');
        }
        else {
            dom[0].classList.add('myPush');
        }

        for (var i = 0; i < dom2.length; i++) {
            if (dom2[i].classList.contains('myPush')) {
                dom2[i].classList.remove('myPush');
            }
            else {
                dom2[i].classList.add('myPush');
            }
        }

        if (navSize.classList.contains('smallMenu')) {
            navSize.classList.remove('smallMenu');
        }
        else {
            navSize.classList.add('smallMenu');
        }

        if (mainContaniner[0].classList.contains('maincontainerSmallMenu')) {
            mainContaniner[0].classList.remove('maincontainerSmallMenu');
        }
        else {
            mainContaniner[0].classList.add('maincontainerSmallMenu');
        }
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('push-right');
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
