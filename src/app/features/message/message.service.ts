import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from '../base-api.service';
import { Message } from './message.entity';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends BaseAPIService {
  endpoint = '/messages';

  loadMessage(uuid: string): Observable<Message[]> {
    return this.performGet([this.endpoint], 'uuid={}'.replace('{}', uuid));
  }

  getMessages(): Observable<Message[]> {
    return this.performGet([this.endpoint]);
  }
}
