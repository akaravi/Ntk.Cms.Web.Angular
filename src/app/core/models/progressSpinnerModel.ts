import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export class ProgressSpinnerModel {
  display = false;
  message = 'Loading ... ';
  color?: ThemePalette;
  diameter?: number = 20;
  mode?: ProgressSpinnerMode;
  strokeWidth?: number = 50;
  value?: number;
  backdropEnabled = true;
  Globally = true;
  positionGloballyCenter = true;

}
