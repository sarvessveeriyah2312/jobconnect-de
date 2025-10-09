import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-custom-multistepprogressbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './custom-multistepprogressbar.component.html',
  styleUrls: ['./custom-multistepprogressbar.component.scss']
})
export class CustomMultiStepProgressBarComponent {
  @Input() totalSteps = 5;
  @Input() currentStep = 1;
  @Input() stepsLabels: string[] = [];
  @Input() clickableSteps = false;
  @Output() stepChange = new EventEmitter<number>();

  isActive(step: number): boolean {
    return this.currentStep >= step;
  }

  isCompleted(step: number): boolean {
    return this.currentStep > step;
  }

  isCurrent(step: number): boolean {
    return this.currentStep === step;
  }

  getProgressWidth(): number {
    return (this.currentStep - 1) * (100 / (this.totalSteps - 1));
  }

  getStepClasses(step: number): string {
    if (this.isCompleted(step)) {
      return 'bg-gradient-to-br from-green-400 to-emerald-600 text-white border-transparent shadow-md';
    } else if (this.isCurrent(step)) {
      return 'bg-white text-green-600 border-green-500 pulse-glow';
    } else {
      return 'bg-gray-50 text-gray-400 border-gray-300';
    }
  }

  getLabelClasses(step: number): string {
    if (this.isCurrent(step)) {
      return 'text-green-600 dark:text-green-400 font-semibold';
    } else if (this.isActive(step)) {
      return 'text-gray-800 dark:text-gray-200';
    } else {
      return 'text-gray-400 dark:text-gray-500';
    }
  }

  onStepClick(step: number): void {
    if (this.clickableSteps && step <= this.currentStep) {
      this.stepChange.emit(step);
    }
  }
}
