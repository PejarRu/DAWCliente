import { Directive, ElementRef, EventEmitter } from '@angular/core';
import { OnInit,Output } from '@angular/core';
import { LoadGoogleApiService } from './load-google-api.service';

@Directive({
  standalone: true,
  selector: '[appGoogleLogin]'
})
export class GoogleLoginDirective implements OnInit {
  @Output() loginOk = new EventEmitter<gapi.auth2.GoogleUser>();
  @Output() loginError = new EventEmitter<string>();
  @Output() loadingEnd = new EventEmitter<void>();

  constructor(
    private el: ElementRef,
    private loadService: LoadGoogleApiService
  ) { }

  ngOnInit(): void {
    this.loadService.getAuthApi().subscribe(
      auth2 => {
        auth2.attachClickHandler(
          this.el.nativeElement, {},
          (user: gapi.auth2.GoogleUser) => {
            this.loginOk.emit(user);
          },
          error => this.loginError.emit(error)
        );
        this.loadingEnd.emit();
      }
    );
  }
}
