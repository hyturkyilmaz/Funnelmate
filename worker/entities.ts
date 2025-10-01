import { IndexedEntity } from './core-utils';
import type { AppSettings, User } from '@shared/types';
import { MOCK_INTEGRATIONS, MOCK_SUBSCRIPTION_PLANS } from '@shared/mock-data';
import type { Env } from './core-utils';
const GLOBAL_SETTINGS_ID = 'v1';
const initialIntegrationsStatus = MOCK_INTEGRATIONS.reduce((acc, integration) => {
  acc[integration.id] = integration.status === 'connected';
  return acc;
}, {} as Record<string, boolean>);
const initialActiveSubscriptionId = MOCK_SUBSCRIPTION_PLANS.find((p) => p.isCurrent)?.id || 'pro';
export class AppSettingsEntity extends IndexedEntity<AppSettings> {
  static readonly entityName = 'AppSettings';
  static readonly initialState: AppSettings = {
    id: GLOBAL_SETTINGS_ID,
    activeSubscriptionId: initialActiveSubscriptionId,
    integrationsStatus: initialIntegrationsStatus
  };
  static async getSingleton(env: Env): Promise<AppSettingsEntity> {
    const entity = new AppSettingsEntity(env, GLOBAL_SETTINGS_ID);
    if (!(await entity.exists())) {
      await entity.save(AppSettingsEntity.initialState);
    }
    return entity;
  }
  async setSubscription(planId: string): Promise<AppSettings> {
    return this.mutate((state) => ({ ...state, activeSubscriptionId: planId }));
  }
  async toggleIntegration(integrationId: string): Promise<AppSettings> {
    return this.mutate((state) => {
      const currentStatus = state.integrationsStatus[integrationId] ?? false;
      return {
        ...state,
        integrationsStatus: {
          ...state.integrationsStatus,
          [integrationId]: !currentStatus
        }
      };
    });
  }
}
// --- New User Entity ---
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = 'User';
  static readonly indexName = 'users';
  static readonly initialState: User = {
    id: '',
    email: '',
    name: '',
    role: 'brand',
  };
  // Use email as the key for simplicity in this mock setup
  static override keyOf(state: { email: string }): string {
    return state.email;
  }
  static async findByEmail(env: Env, email: string): Promise<UserEntity | null> {
    const user = new UserEntity(env, email);
    if (await user.exists()) {
      return user;
    }
    return null;
  }
}