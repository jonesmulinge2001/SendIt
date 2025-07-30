
import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { HomeComponent } from './components/home/home.component';

import { LayoutComponent } from './admin/layout/layout.component';

import { AdminGuard } from './guards/admin.guard';
import { DashboardComponent } from './admin/dashboard/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users/users.component';
import { LogsComponent } from './admin/logs/logs.component';
import { TrackingComponent } from './admin/tracking/tracking.component';
import { ParcelListComponent } from './admin/parcels/parcels/parcels.component';
import { ParcelCreateComponent } from './admin/parcel-create/parcel-create.component';
import { EmailLogsComponent } from './admin/email-logs.component';
import { ParcelTrackingComponent } from './admin/tracking/parcel-tracking/parcel-tracking.component';
import { TrackingHistoryComponent } from './admin/tracking-history.component';
import { AddTrackingEntryComponent } from './admin/parceltrackingentry.component';
import { ParcelDetailsComponent } from './admin/parcels/parcel-details/parcel-details.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { UserParcelsComponent } from './components/my-dashboard/my-dashboard.component';
import { DriverGuard } from './guards/driver.guard';
import { NavigationComponent } from './driver/navigation/navigation.component';
import { ParcelsListComponent } from './driver/parcellist/parcellist.component';
import { TrackingLogComponent } from './driver/trackinlog/trackinlog.component';
import { StatusUpdateComponent } from './driver/statusupdate/statusupdate.component';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {path: 'about-us', component: AboutUsComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'my-dashboard', component: UserParcelsComponent},


  // Admin routes (protected)
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'parcels', component: ParcelListComponent },
      { path: 'users', component: UsersComponent },
      {path: 'logs', component: LogsComponent},
      {path: 'tracking', component: TrackingHistoryComponent},
      {path: 'create-parcel', component: ParcelCreateComponent},
      {path: 'email-logs', component: EmailLogsComponent},
      {
        path: 'parcels/:id',
        loadComponent: () =>
          import('./admin/parcels/parcel-details/parcel-details.component')
            .then(m => m.ParcelDetailsComponent)
      },
      { path: 'parcels/details/:id', component: ParcelDetailsComponent }

    ],
  },

  {
    path: 'driver',
    canActivate: [DriverGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: NavigationComponent},
      {path: 'parcels', component: ParcelsListComponent},
      { path: 'tracking/:id', component: StatusUpdateComponent } 

    ],
  },
];
