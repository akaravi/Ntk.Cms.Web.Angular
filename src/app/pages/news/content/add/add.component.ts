import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Leaflet from 'leaflet';
import {environment} from '../../../../../environments/environment';
import {FormControl, FormGroup} from '@angular/forms';
import {CoreEnumService, EnumModel, ErrorExceptionResult, FormInfoModel, NewsContentModel, NewsContentService} from 'ntk-cms-api';
import {ActivatedRoute} from '@angular/router';
import KTWizard from '../../../../../assets/js/components/wizard';
import {KTUtil} from '../../../../../assets/js/components/util';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';

@Component({
    selector: 'app-news-content-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'
    ]
})
export class NewsContentAddComponent implements OnInit, AfterViewInit {

    @ViewChild('wizard', {static: true}) el: ElementRef;

    dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
    dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

    loadingStatus = false;
    dataModel = new NewsContentModel();
    linkCategoryId: number;
    formInfo: FormInfoModel = new FormInfoModel();
    singUpContentForm: FormGroup;
    items = ['Javascript', 'Typescript'];
    theMarker: any;
    map: Leaflet.Map;
    model: any;
    lat: any;
    lon: any;
    wizard: any;
    editor = ClassicEditor;
    data: any = `<p>Hello, world!</p>`;


    constructor(
        private activatedRoute: ActivatedRoute,
        public coreEnumService: CoreEnumService,
        private newsContentService: NewsContentService,
        private toasterService: CmsToastrService
    ) {

    }

    parentId = 0;

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.parentId = +params.parentId || 0;
        });

        this.singUpContentForm = new FormGroup({
            status: new FormControl(null),
            title: new FormControl(null),
            description: new FormControl(null),
            tag: new FormControl(null),
            keyWords: new FormControl(null),
            ckeditor: new FormControl(null),
            fromDate: new FormControl(null),
            expireDate: new FormControl(null)
        });
        if (this.parentId === 0) {
            this.toasterService.typeErrorAddRowParentIsNull();
            return;
        }
        this.getEnumRecordStatus();
    }

    ngAfterViewInit(): void {

        this.wizard = new KTWizard(this.el.nativeElement, {
            startStep: 1
        });

        this.map = Leaflet.map('map', {center: [32.684985, 51.6359425], zoom: 16});
        Leaflet.tileLayer(environment.leafletUrl).addTo(this.map);
        this.map.on('click', (e) => {
            // @ts-ignore
            this.lat = e.latlng.lat;
            // @ts-ignore
            this.lon = e.latlng.lng;
            if (this.theMarker !== undefined) {
                this.map.removeLayer(this.theMarker);
            }
            this.theMarker = Leaflet.marker([this.lat, this.lon]).addTo(this.map);
        });
    }

    getEnumRecordStatus(): void {
        this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
            this.dataModelEnumRecordStatusResult = res;
        });
    }

    onFormSubmit(): void {
        if (this.parentId === 0) {
            this.toasterService.typeErrorAddRowParentIsNull();
            return;
        }
        if (this.singUpContentForm.valid) {
            this.formInfo.FormAllowSubmit = false;
            this.DataAddContent();
        }
    }

    DataAddContent(): void {
        this.dataModel.Title = this.singUpContentForm.get('title').value;
        this.dataModel.Description = this.singUpContentForm.get('description').value;
        // this.dataModel.FromDate = this.FromDate.nativeElement.value;
        // this.dataModel.ExpireDate = this.expireDate.nativeElement.value;
        this.dataModel.RecordStatus = this.singUpContentForm.get('status').value;
        this.dataModel.Geolocationlatitude = this.lat;
        this.dataModel.Geolocationlongitude = this.lon;
        if (this.linkCategoryId <= 0) {
            this.toasterService.toastr.error(
                'دسته بندی را مشخص کنید',
                'دسته بندی اطلاعات مشخص نیست'
            );
            return;
        }
        this.dataModel.LinkCategoryId = this.parentId;
        this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
        this.formInfo.FormError = '';
        this.loadingStatus = true;
        this.newsContentService
            .ServiceAdd(this.dataModel)
            .subscribe(
                (next) => {
                    this.loadingStatus = false;
                    this.formInfo.FormAllowSubmit = !next.IsSuccess;
                    this.dataModelResult = next;
                    if (next.IsSuccess) {
                        this.formInfo.FormAlert = 'ثبت با موفقت انجام شد';
                        this.toasterService.typeSuccessAdd();
                    } else {
                        this.toasterService.typeErrorAdd(next.ErrorMessage);
                    }
                },
                (error) => {
                    this.loadingStatus = false;
                    this.formInfo.FormAllowSubmit = true;

                    const title = 'برروی خطا در دریافت اطلاعات';
                    this.toasterService.typeError(error);
                }
            );
    }

    onValueChange(model: any): any {
        return model.value;
    }

}
