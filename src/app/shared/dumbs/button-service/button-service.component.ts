import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DragDropModule } from 'primeng/dragdrop';
import { TooltipModule } from 'primeng/tooltip';
import { ServiceTypeEnum } from '../../../core/enums/service.type.enum';
import { GlobalDragButtonService } from '../../../core/services/global-drag-button.service';

@Component({
  selector: 'app-button-service',
  standalone: true,
  imports: [CommonModule, TooltipModule, DragDropModule],
  templateUrl: './button-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonServiceComponent {
  @Input() public serviceType: ServiceTypeEnum;

  public readonly serviceInfo: Record<ServiceTypeEnum, { src: string; tooltip: string }> = {
    [ServiceTypeEnum.PROJECT]: {
      src: 'assets/icons/service/project.png',
      tooltip: '<p>Проект</p>'
    }
  };

  public constructor(private readonly globalDragButtonService: GlobalDragButtonService) {}

  public dragStart() {
    this.globalDragButtonService.setState(this.serviceType);
  }

  public dragEnd() {
    this.globalDragButtonService.setState(null);
  }
}
