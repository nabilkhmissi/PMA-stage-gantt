import { NgModule } from "@angular/core";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SharedModule } from "../shared.module";
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
  declarations: [FileUploadComponent, BreadcrumbComponent, ImageUploadComponent],
  imports: [SharedModule],
  exports: [FileUploadComponent, BreadcrumbComponent ,ImageUploadComponent],
})
export class ComponentsModule {}
