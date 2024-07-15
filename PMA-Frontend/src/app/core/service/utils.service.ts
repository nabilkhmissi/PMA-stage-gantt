import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  //converting pic buffer data into base64 string
  bufferToBase64(arr: any) {

    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
      arr.reduce((data: any, byte: any) => data + String.fromCharCode(byte), '')
    );
  }

  //converting base64 strings of the pics buffer data into pics data
  base64ToPic(media: any) {
    return `data:${media.mimetype};base64,${this.bufferToBase64(media.buffer.data)}`;
  }
}
