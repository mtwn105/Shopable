import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string) {
    if (message)
      this._snackBar.open(message);
    else
      this._snackBar.open("Something went wrong. Please try again.");
  }

}
