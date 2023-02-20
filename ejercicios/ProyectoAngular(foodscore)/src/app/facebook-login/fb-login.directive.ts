import { Directive, ElementRef, EventEmitter, HostListener, Input } from '@angular/core';
import { OnInit, Output } from '@angular/core';
import { LoadFbApiService } from './load-fb-api.service';

@Directive({
  selector: '[appFbLogin]',
  standalone: true
})
export class FbLoginDirective implements OnInit {

  @Output() loginOk: EventEmitter<fb.StatusResponse> = new EventEmitter<fb.StatusResponse>();

  @Output() loginError: EventEmitter<string> = new EventEmitter<string>();

  @Output() loadingEnd: EventEmitter<void> = new EventEmitter<void>();

  @Input() scopes!: string[];

  constructor(private el: ElementRef, private loadService: LoadFbApiService) { }

  ngOnInit(): void {
    this.loadService.loadApi().subscribe(
      () => this.loadingEnd.emit()
    );
  }

  @HostListener('click') onClick(): void {
    this.loadService.login(this.scopes.join(',')).subscribe({
      next: resp => this.loginOk.emit(resp),
      error: error => this.loginError.emit('Error with Facebook login! Try changing browsee')
    });
  }

}
