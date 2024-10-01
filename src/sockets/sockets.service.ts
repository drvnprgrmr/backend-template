import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

interface SocketEvent {
  room?: string;
  name: string;
  data: unknown;
}

@Injectable()
export class SocketsService {
  private readonly subject = new Subject<SocketEvent>();

  emit(room: string, name: string, data?: unknown): void {
    this.subject.next({ room, name, data });
  }

  broadcast(name: string, data?: unknown): void {
    this.subject.next({ name, data });
  }

  getSubject$(): Observable<SocketEvent> {
    return this.subject.asObservable();
  }
}
