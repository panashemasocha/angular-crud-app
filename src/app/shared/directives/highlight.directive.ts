// Import Directive decorator to create an attribute directive
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * HighlightDirective
 * Attribute directive that changes background color on mouse hover
 * Usage: <div appHighlight="yellow"></div>
 */
@Directive({
  // selector defines how this directive is applied to elements via attribute syntax
  selector: '[appHighlight]'
})
export class HighlightDirective {
  // @Input decorator allows passing a color value to the directive
  // appHighlight property name matches the directive selector for input binding
  // Default color is light blue (#e3f2fd) if no value is provided
  @Input() appHighlight = '#e3f2fd';

  // Constructor injects ElementRef to access the DOM element this directive is applied to
  constructor(private el: ElementRef) {}

  // @HostListener decorator binds to mouseenter DOM event on the host element
  // When user hovers over the element, this method is triggered
  @HostListener('mouseenter') onMouseEnter(): void {
    // Call highlight method with the specified color to apply background color
    this.highlight(this.appHighlight);
  }

  // @HostListener decorator binds to mouseleave DOM event on the host element
  // When user moves mouse away from the element, this method is triggered
  @HostListener('mouseleave') onMouseLeave(): void {
    // Call highlight method with empty string to remove the background color
    this.highlight('');
  }

  // Private helper method that applies or removes the background color
  // color parameter: the color string to apply, or empty string to remove color
  private highlight(color: string): void {
    // nativeElement accesses the underlying DOM element
    // style.backgroundColor sets the CSS background-color property
    this.el.nativeElement.style.backgroundColor = color;
  }
}