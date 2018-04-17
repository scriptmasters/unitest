import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentGuard } from './student-guard.service';
import { AdminGuard } from './admin-guard.service';




const routes: Routes = [
    { path: '', redirectTo: '/admin/statistic', pathMatch: 'full' },
    { path: 'student', canActivate: [StudentGuard], loadChildren: './student/student.module#StudentModule' },
    { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'admin', canActivate: [AdminGuard], loadChildren: './admin/admin.module#AdminModule'}
    // { path: '**', redirectTo: '/admin', pathMatch: 'full' }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
