import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../artist.service';
import { Artist, ArtistRequest } from '../../artist.interface';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { filter, finalize, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'artist-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent {
  public artist?: Artist;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private artistService: ArtistService
  ){
    Swal.fire("obteniendo Artista", undefined, "info");
    Swal.showLoading();

    of(this.auth.hasAdminRole()).pipe(
      tap(role => !role ? Swal.fire("obteniendo Artista", "no tienes permisos para ver este artista", "error") : null ),
      tap(role => !role ? this.router.navigate([""]) : null ),
      filter(role => role),
      switchMap(() => this.artistService.get(this.route.snapshot.paramMap.get("_id") as string)),
      finalize(() => Swal.close())
    ).subscribe({
      next: (artist) => this.artist = artist,
      error: () => this.router.navigate(["/artist"])
    });
  }

  getIMG(){
    return () => this.artist ? this.artistService.getImg(this.artist._id): null;
  }

  public submitData(data: ArtistRequest){
    if(!this.artist) return;
    Swal.fire("actualizando Artista", undefined, "info");
    Swal.showLoading();
    this.artistService.update(this.artist._id, data as ArtistRequest).subscribe(response => {
      if(typeof response === "string") return Swal.fire("actualizando Artista", response, "error");
      Swal.fire("actualizando Artista", "Artista actualizado correctamente", "success");
      return this.router.navigate(["/artist", response._id]);
    })
  }

  public submitIMG(file: File){
    if(!this.artist) return;
    Swal.fire("actualizando IMG Artista", undefined, "info");
    Swal.showLoading();

    this.artistService.updateIMG(this.artist._id, file).subscribe(_ => {
      Swal.fire({
        title: "actualizando IMG Artista",
        text: "Foto de Artista actualizada correctamente",
        icon: "success"
      })
    })
  }
}
