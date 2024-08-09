import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideState, provideStore, StoreModule } from '@ngrx/store';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { AuthEffects } from './features/auth/auth.effects';
import { MessageEffects } from './features/message/message.effects';
import { messageKey, messageReducer } from './features/message/message.state';
import { UserEffects } from './features/user/user.effects';
import { userKey, userReducer } from './features/user/user.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore({ [userKey]: userReducer, [messageKey]: messageReducer }),
    provideEffects(UserEffects, MessageEffects, AuthEffects),
    provideState({ name: messageKey, reducer: messageReducer }),
    importProvidersFrom(
      StoreModule.forRoot({ user: userReducer, messages: messageReducer })
    ),
  ],
};
