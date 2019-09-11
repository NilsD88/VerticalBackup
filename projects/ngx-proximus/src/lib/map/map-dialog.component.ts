import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'pxs-map-dialog',
    templateUrl: './map-dialog.component.html',
    styleUrls: ['./map-dialog.component.scss']
})

export class MapDialogComponent implements OnInit {
    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {

    }
}