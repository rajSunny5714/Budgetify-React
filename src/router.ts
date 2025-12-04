// src/router.ts
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routerTree.gen' 

// Create the router instance
export const router = createRouter({
  routeTree,
  context: {}, 
  defaultPreload: 'intent',
})