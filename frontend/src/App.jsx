import React from 'react';
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateLayout from './pages/PrivateLayout';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import MyStyle from './pages/MyStyle';
import Contents from './pages/Contents';
import Training from './pages/Training';
import History from './pages/History';
import Evolution from './pages/Evolution';
import Profile from './pages/Profile';

const rootRoute = createRootRoute({ component: () => <Outlet /> });
const publicPages = [
  ['/', Home], ['/login', Login], ['/registo', Register],
].map(([path, component]) => createRoute({ getParentRoute: () => rootRoute, path, component }));
const privateRoute = createRoute({ getParentRoute: () => rootRoute, id: 'privado', component: PrivateLayout });
const privatePages = [
  ['/inicio', Dashboard], ['/quiz', Quiz], ['/resultados', Results],
  ['/meu-estilo', MyStyle], ['/conteudos', Contents], ['/treinar', Training],
  ['/historico', History], ['/evolucao', Evolution], ['/perfil', Profile],
].map(([path, component]) => createRoute({ getParentRoute: () => privateRoute, path, component }));
const routeTree = rootRoute.addChildren([...publicPages, privateRoute.addChildren(privatePages)]);
const router = createRouter({ routeTree, defaultPreload: 'intent' });
export default function App() { return <RouterProvider router={router} />; }
