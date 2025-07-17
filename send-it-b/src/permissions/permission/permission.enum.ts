/* eslint-disable prettier/prettier */
export enum Permission {
    // User Management
    MANAGE_USERS = 'MANAGE_USERS',
    VIEW_USERS = 'VIEW_USERS',
  
    // Parcel Management
    CREATE_PARCEL = 'CREATE_PARCEL',
    UPDATE_PARCEL_STATUS = 'UPDATE_PARCEL_STATUS',
    VIEW_PARCELS = 'VIEW_PARCELS',
  
    // Profile & Dashboard
    MANAGE_PROFILE = 'MANAGE_PROFILE',
    ACCESS_ADMIN_DASHBOARD = 'ACCESS_ADMIN_DASHBOARD',
  
    // Analytics
    VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  
    // Notification (email/sms)
    SEND_NOTIFICATIONS = 'SEND_NOTIFICATIONS',
    MANAGE_EMAILS = 'MANAGE_EMAILS',
  }
  