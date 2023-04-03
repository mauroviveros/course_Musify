import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidarTokenGuard } from './modules/auth/guards/validar-token.guard';
import { MusifyComponent } from './pages/musify/musify.component';

const routes: Routes = [
  {
    path: "",
    loadChildren: ()=> import("./modules/musify/musify.module").then(m => m.MusifyModule),
    canActivate: [ValidarTokenGuard],
    component: MusifyComponent
  },
  {
    path: "",
    loadChildren: ()=> import("./modules/auth/auth.module").then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
