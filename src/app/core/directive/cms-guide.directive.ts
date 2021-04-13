import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CoreGuideService } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { CmsToastrService } from '../services/cmsToastr.service';

@Directive({
  selector: '[appCmsGuide]'
})
export class CmsGuideDirective {
  @Input() appCmsGuide: string;
  @Input() message: string;
  constructor(
    private el: ElementRef,
    private coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
  ) {
  }
  @HostListener('mouseenter') onMouseEnter(): void {
    this.highlight('red');
    this.tooltip(this.appCmsGuide);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.highlight(null);
  }
  private highlight(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
  private tooltip(key: string): void {
    debugger

  }

}
