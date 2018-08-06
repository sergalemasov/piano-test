import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { tap } from 'rxjs/operators/tap';
import { LocalApiService } from '@services';
import { Observable } from 'rxjs/Observable';

enum AuthButton {
  FIRST,
  SECOND,
  THIRD
}

enum AuthButtonAction {
  SIGN_IN = 1,
  SIGN_UP,
  SIGN_IN_STACK_OVERFLOW,
  SIGN_UP_STACK_OVERFLOW
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit, OnDestroy {
  private static stateNames: { [key: string]: string } = {
    SIGN_IN: 'Sign In',
    SIGN_UP: 'Sign Up'
  };

  private isSignIn: boolean = true;
  private destroy$: Subject<void> = new Subject();
  private actionDispatcher$: Subject<AuthButtonAction> = new Subject();

  constructor(private localApiService: LocalApiService) {}

  public ngOnInit(): void {
    this.setupButtonActions();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get title(): string {
    return `Please ${this.getCurrentStateName()}`;
  }

  public get firstBtnName(): string {
    return this.getCurrentStateName();
  }

  public get secondBtnName(): string {
    return `Go to ${!this.isSignIn ? AuthComponent.stateNames.SIGN_IN : AuthComponent.stateNames.SIGN_UP}`;
  }

  public get thirdBtnName(): string {
    return `${this.getCurrentStateName()} with Stack Overflow`;
  }

  public onFormSubmit(): boolean {
    return false;
  }

  public onFirstBtnClick(event: Event): void {
    this.onBtnClick(event, AuthButton.FIRST);
  }

  public onSecondBtnClick(event: Event): void {
    this.onBtnClick(event, AuthButton.SECOND);
  }

  public onThirdBtnClick(event: Event): void {
    this.onBtnClick(event, AuthButton.THIRD);
  }

  private onBtnClick(event: Event, button: AuthButton): void {
    if (event) {
      event.preventDefault();
    }

    switch (button) {
      case AuthButton.FIRST:
        this.isSignIn
          ? this.dispatch(AuthButtonAction.SIGN_IN)
          : this.dispatch(AuthButtonAction.SIGN_UP);
        break;

      case AuthButton.SECOND:
        this.toggleView();
        break;

      case AuthButton.THIRD:
        this.isSignIn
          ? this.dispatch(AuthButtonAction.SIGN_IN_STACK_OVERFLOW)
          : this.dispatch(AuthButtonAction.SIGN_UP_STACK_OVERFLOW);
        break;
    }
  }

  private toggleView(): void {
    this.isSignIn = !this.isSignIn;
  }

  private dispatch(action: AuthButtonAction): void {
    this.actionDispatcher$.next(action);
  }

  private setupButtonActions(): void {
    this.actionDispatcher$
      .pipe(
        switchMap((action: AuthButtonAction) => {
          switch (action) {
            case AuthButtonAction.SIGN_IN:
              return this.signIn();
            case AuthButtonAction.SIGN_UP:
              return this.signUp();
            // TODO: implement after stack overflow service
            case AuthButtonAction.SIGN_IN_STACK_OVERFLOW:
              return Observable.of(null);
            case AuthButtonAction.SIGN_UP_STACK_OVERFLOW:
              return Observable.of(null);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private getCurrentStateName(): string {
    return this.isSignIn
      ? AuthComponent.stateNames.SIGN_IN
      : AuthComponent.stateNames.SIGN_UP;
  }

  private signIn(): Observable<any> {
    return this.localApiService.signIn()
      .pipe(
        tap((res) => console.log(res))
      );
  }

  private signUp(): Observable<any> {
    return this.localApiService.signUp();
  }
}
