import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  public constructor(private sanitized: DomSanitizer) {}

  public transform(value = '') {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
