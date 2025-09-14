import * as Localization from 'expo-localization';

// Simple i18n implementation following workspace rules
// In a production app, you would use react-native-i18n or similar

export interface Translations {
  [key: string]: string;
}

const translations: Record<string, Translations> = {
  en: {
    // Auth
    'auth.welcome_back': 'Welcome Back',
    'auth.create_account': 'Create Account',
    'auth.sign_in_subtitle': 'Sign in to continue managing your subscriptions',
    'auth.sign_up_subtitle': 'Join thousands managing their subscriptions smarter',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.full_name': 'Full Name',
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Sign Up',
    'auth.create_account_button': 'Create Account',
    'auth.dont_have_account': "Don't have an account? ",
    'auth.already_have_account': 'Already have an account? ',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to your Dashboard!',
    'dashboard.welcome_back': 'Welcome back, {{name}}!',
    'dashboard.subtitle': 'Manage your subscriptions and track your spending',
    'dashboard.total_subscriptions': 'Total Subscriptions',
    'dashboard.monthly_cost': 'Monthly Cost',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.add_subscription': 'Add Subscription',
    'dashboard.view_analytics': 'View Analytics',
    
    // Profile
    'profile.title': 'Profile',
    'profile.subtitle': 'Manage your account settings and preferences',
    'profile.settings': 'Settings',
    'profile.dark_mode': 'Dark Mode',
    'profile.sign_out': 'Sign Out',
    'profile.sign_out_confirm': 'Are you sure you want to sign out?',
    'profile.cancel': 'Cancel',
    
    // Common
    'common.loading': 'Loading...',
    'common.redirecting': 'Redirecting...',
    'common.try_again': 'Try Again',
    'common.error': 'Error',
    'common.something_wrong': 'Something went wrong',
    'common.error_message': "We're sorry, but something unexpected happened. Please try again.",
    'common.unexpected_error': 'An unexpected error occurred',
    'common.validation_failed': 'Validation failed',
  },
};

export function getCurrentLocale(): string {
  return Localization.locale.split('-')[0] || 'en';
}

export function t(key: string, params?: Record<string, string>): string {
  const locale = getCurrentLocale();
  const translation = translations[locale]?.[key] || translations.en[key] || key;
  
  if (params) {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => params[param] || match);
  }
  
  return translation;
}

export function getSupportedLocales(): string[] {
  return Object.keys(translations);
}
