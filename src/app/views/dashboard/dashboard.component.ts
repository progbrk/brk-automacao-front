import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, RowComponent } from '@coreui/angular';

@Component({
  templateUrl: 'dashboard.component.html',
  imports: [ButtonDirective, CardBodyComponent, CardComponent, ColComponent, RowComponent, RouterLink]
})
export class DashboardComponent {}
