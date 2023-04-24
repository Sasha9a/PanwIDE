import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalStorageService } from '../../../core/services/global.storage.service';

@Component({
  standalone: true,
  selector: 'app-service-project',
  templateUrl: './service-project.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceProjectComponent {
  public constructor(public readonly globalStorageService: GlobalStorageService) {}
}
