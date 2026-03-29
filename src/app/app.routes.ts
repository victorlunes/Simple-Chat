import { Routes } from '@angular/router';
import { SimpleChat } from './chat/simple-chat/simple-chat';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'simple-chat',
        pathMatch: 'full'
    },
    {
        path: 'simple-chat',
        loadComponent: () => import('./chat/simple-chat/simple-chat').then(c => c.SimpleChat)
    },
    {
        path: '**',
        redirectTo: 'simple-chat'
    }
];
