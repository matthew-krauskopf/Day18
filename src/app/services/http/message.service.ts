import { Injectable } from '@angular/core';
import { BaseAPIService } from './base-api.service';
import { Observable } from 'rxjs';
import { Message } from '../../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends BaseAPIService {
  endpoint = '/messages';

  loadMessage(uuid: string): Observable<Message[]> {
    return this.performGet([this.endpoint], 'uuid={}'.replace('{}', uuid));
  }

  loadMessages(): Observable<Message[]> {
    return this.performGet([this.endpoint]);
  }
}
