import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true, 
  imports: [],
  templateUrl: './textarea.html',
  styleUrl: './textarea.css', 
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {

  @Input() label: string = '';
  @Input() rows: number = 5;
  @Input() placeholder: string = '';

  value: string = '';
  disabled: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string) {
    this.value = value ?? '';
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.onChange(value);
  }
}
