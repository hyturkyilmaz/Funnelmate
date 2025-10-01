import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { MOCK_KPIS, MOCK_CHART_DATA, MOCK_INTEGRATIONS, MOCK_SUBSCRIPTION_PLANS } from "@shared/mock-data";
import { AppSettingsEntity, UserEntity } from "./entities";
import type { User } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- Authentication Routes ---
  app.post('/api/auth/signup', async (c) => {
    const { name, email, password } = await c.req.json<{ name: string; email: string; password: string }>();
    if (!name || !email || !password) {
      return bad(c, 'Missing required fields');
    }
    const existingUser = await UserEntity.findByEmail(c.env, email);
    if (existingUser) {
      return bad(c, 'User with this email already exists');
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In a real app, this would be hashed
      role: 'brand', // Default role
    };
    await UserEntity.create(c.env, newUser);
    const { password: _, ...userResponse } = newUser;
    return ok(c, userResponse);
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json<{ email: string; password: string }>();
    if (!email || !password) {
      return bad(c, 'Email and password are required');
    }
    const userEntity = await UserEntity.findByEmail(c.env, email);
    if (!userEntity) {
      return notFound(c, 'User not found');
    }
    const user = await userEntity.getState();
    // Mock password check
    if (user.password !== password) {
      return bad(c, 'Invalid credentials');
    }
    const { password: _, ...userResponse } = user;
    return ok(c, userResponse);
  });
  app.post('/api/auth/logout', (c) => {
    // In a real app, this would invalidate a session/token
    return ok(c, { message: 'Logged out successfully' });
  });
  app.get('/api/auth/me', async (c) => {
    // Mock getting user from a session. We'll use a header for simplicity.
    const userEmail = c.req.header('X-User-Email');
    if (!userEmail) {
      return c.json({ success: false, error: 'Not authenticated' }, 401);
    }
    const userEntity = await UserEntity.findByEmail(c.env, userEmail);
    if (!userEntity) {
      return notFound(c, 'User not found');
    }
    const user = await userEntity.getState();
    const { password: _, ...userResponse } = user;
    return ok(c, userResponse);
  });
  // --- User Profile Update ---
  app.post('/api/user/profile', async (c) => {
    const userEmail = c.req.header('X-User-Email');
    if (!userEmail) {
      return c.json({ success: false, error: 'Not authenticated' }, 401);
    }
    const userEntity = await UserEntity.findByEmail(c.env, userEmail);
    if (!userEntity) {
      return notFound(c, 'User not found');
    }
    const { name } = await c.req.json<{ name: string }>();
    if (!name) {
      return bad(c, 'Name is required');
    }
    await userEntity.patch({ name });
    const updatedUser = await userEntity.getState();
    const { password: _, ...userResponse } = updatedUser;
    return ok(c, userResponse);
  });
  // --- Clarity AI Mock Endpoints (Static) ---
  app.get('/api/analytics/kpis', (c) => {
    return ok(c, MOCK_KPIS);
  });
  app.get('/api/analytics/charts', (c) => {
    return ok(c, MOCK_CHART_DATA);
  });
  // --- Dynamic Endpoints with Durable Objects ---
  app.get('/api/integrations', async (c) => {
    const settings = await AppSettingsEntity.getSingleton(c.env);
    const state = await settings.getState();
    const integrationsWithStatus = MOCK_INTEGRATIONS.map(integration => ({
      ...integration,
      status: state.integrationsStatus[integration.id] ? 'connected' : 'disconnected',
    }));
    return ok(c, integrationsWithStatus);
  });
  app.post('/api/integrations/:id/toggle', async (c) => {
    const { id } = c.req.param();
    if (!MOCK_INTEGRATIONS.some(i => i.id === id)) {
      return bad(c, 'Integration not found');
    }
    const settings = await AppSettingsEntity.getSingleton(c.env);
    await settings.toggleIntegration(id);
    return ok(c, { success: true });
  });
  app.get('/api/billing/plans', async (c) => {
    const settings = await AppSettingsEntity.getSingleton(c.env);
    const state = await settings.getState();
    const plansWithStatus = MOCK_SUBSCRIPTION_PLANS.map(plan => ({
      ...plan,
      isCurrent: plan.id === state.activeSubscriptionId,
    }));
    return ok(c, plansWithStatus);
  });
  app.post('/api/billing/plan', async (c) => {
    const { planId } = await c.req.json<{ planId: string }>();
    if (!MOCK_SUBSCRIPTION_PLANS.some(p => p.id === planId)) {
      return bad(c, 'Plan not found');
    }
    const settings = await AppSettingsEntity.getSingleton(c.env);
    const updatedState = await settings.setSubscription(planId);
    return ok(c, { activeSubscriptionId: updatedState.activeSubscriptionId });
  });
}