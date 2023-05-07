import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'parseFormErrorToString',
  standalone: true
})
export class ParseFormErrorToStringPipe implements PipeTransform {
  public transform(errors: ValidationErrors, directory: Record<string, string>): string {
    if (errors) {
      return (
        Object.keys(errors)
          .map((key) => directory[key])
          .join(', ') || ''
      );
    }
    return '';
  }
}
