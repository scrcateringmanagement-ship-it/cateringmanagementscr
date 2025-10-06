# Comasscr

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


ng s --host 0.0.0.0 --port 4201


****************
ng build --configuration production --base-href /CATADMIN/








 <ul class="list-group mb-3">
                        <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.aadhar_card_file, 'Aadhar Card'); $event.preventDefault()">Aadhar
                                Card</a>
                        </li>
                        <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.photo, 'Photo'); $event.preventDefault()">Photo</a>
                        </li>
                        <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.medical_cert_file, 'Medical Certificate'); $event.preventDefault()">Medical
                                Certificate</a>
                        </li>
                        <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.police_cert_file, 'Police Certificate'); $event.preventDefault()">Police
                                Certificate</a>
                        </li>
                        <!-- <li class="list-group-item">
                            <a href="#" (click)="selectFile(selectedIdcard.money_receipt_file, 'Money Receipt'); $event.preventDefault()">Money Receipt</a>
                        </li> -->
                      
                        <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.last_paid_file, 'Last Paid File'); $event.preventDefault()">LF/PLF/Fine/PI
                                (Penal Interest) Advice Notice</a>
                        </li>
                          <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.dd_mr_file, 'DD/MR File'); $event.preventDefault()">LF
                                Paid Receipt (MERS/e-auction payment)</a>
                        </li>
                        <li class="list-group-item">
                            <a href="#"
                                (click)="selectFile(selectedIdcard.vendor_signature_file, 'Vendor Signature'); $event.preventDefault()">Vendor
                                Signature</a>
                        </li>
                    </ul>



                     <!-- Display selected file -->
                    <div *ngIf="selectedFile">
                        <h6>Viewing: {{ selectedFileName }}</h6>
                        <div *ngIf="isImage(selectedFile)" class="text-center">
                            <div class="mb-2">
                                <button class="btn btn-sm btn-primary me-2" (click)="zoomIn()" title="Zoom In">
                                    <i class="bi bi-zoom-in"></i>
                                </button>
                                <button class="btn btn-sm btn-primary me-2" (click)="zoomOut()" title="Zoom Out">
                                    <i class="bi bi-zoom-out"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" (click)="resetZoom()" title="Reset Zoom">
                                    <i class="bi bi-arrow-counterclockwise"></i>
                                </button>
                            </div>
                            <div class="image-container" style="overflow: auto; max-height: 400px;">
                                <img [src]="selectedFile" class="img-fluid rounded"
                                    [style.transform]="'scale(' + imageScale + ')'"
                                    [style.transformOrigin]="'center center'"
                                    style="transition: transform 0.2s ease-in-out;" alt="Selected File">
                            </div>
                        </div>
                        <div *ngIf="isPdf(selectedFile)" class="pdf-viewer">
                            <pdf-viewer [src]="selectedFile" [show-all]="true" [fit-to-page]="true"
                                style="height: 400px;"></pdf-viewer>
                        </div>
                        <div *ngIf="!isImage(selectedFile) && !isPdf(selectedFile)" class="alert alert-info">
                            <p>Preview not available for this file type.</p>
                        </div>
                    </div>

                    npm install --save-dev @types/crypto-js installed 
                    