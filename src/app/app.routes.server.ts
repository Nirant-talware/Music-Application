import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'playlist/:name',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return a Promise that resolves to an array of parameter objects
      return [
        { name: 'playlist-1' },
        { name: 'playlist-2' }
      ];
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
