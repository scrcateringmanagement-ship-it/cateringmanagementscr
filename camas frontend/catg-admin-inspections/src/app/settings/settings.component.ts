import { Component } from '@angular/core';
import { ApicallService } from '../apicall.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(private apiService: ApicallService) {}

  onDeleteOtps() {
    this.apiService.deleteOtps().subscribe(
      (response: any) => {
        console.log('Delete OTPs response:', response);
        alert(response.message || 'OTPs deleted successfully');
      },
      (error: any) => {
        console.error('Error deleting OTPs:', error);
        alert('Error deleting OTPs: ' + (error.error?.message || error.message));
      }
    );
  }

  onToggleMaintenanceMode() {
    this.apiService.maintenanceMode(true).subscribe(
      (response: any) => {
        console.log('Maintenance Mode response:', response);
        alert('Maintenance mode set to: ' + response.status);
      },
      (error: any) => {
        console.error('Error setting maintenance mode:', error);
        alert('Error setting maintenance mode: ' + (error.error?.message || error.message));
      }
    );
  }

}
