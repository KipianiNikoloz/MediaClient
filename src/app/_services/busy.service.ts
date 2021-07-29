import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount: number = 0;
  isLoading: boolean = false;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy() {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'line-scale-pulse-out-rapid',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: '#32FBE2'
    });

    this.isLoading = true;
  }

  idle() {
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }

    this.isLoading = false;
  }
}
