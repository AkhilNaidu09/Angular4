import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    
    isActive = false;
    showMenu = '';

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        const dom: any = document.getElementById('subMenu');
        if (element === this.showMenu) {
            this.showMenu = '0';
            dom.classList.value = 'fa fa-chevron-down';
        } else {
            this.showMenu = element;
            dom.classList.value = 'fa fa-chevron-up';
        }
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('push-right');
    }
}
