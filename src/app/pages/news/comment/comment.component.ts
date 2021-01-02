import { Component, OnInit } from '@angular/core';
import { NewsCommentService, NewsContentModel } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import { FilterModel, FilterDataModel } from 'ntk-cms-api';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentOptionSearchContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchContentModel';


@Component({
  selector: 'app-news-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class NewsCommentComponent implements OnInit {


  comment: string;
  author: string;
  dataSource: any;
  flag = false;

  tableContentSelected = [];
  optionsSearch: ComponentOptionSearchContentModel = new ComponentOptionSearchContentModel();

  constructor(private newsCommentService: NewsCommentService,
              private activatedRoute: ActivatedRoute,
  ) {
  }

  columnsToDisplay: string[] = ['Id', 'Writer'];
  expandedElement: NewsContentModel | null;

  ngOnInit(): void {
    this.getAllComment();
  }

  getAllComment(): void {
    const filterModel = new FilterModel();
    filterModel.Filters = [];
    const filter = new FilterDataModel();
    filter.PropertyName = 'linkContentid';
    filter.Value = this.activatedRoute.snapshot.params.id;
    filterModel.Filters.push(filter);

    this.newsCommentService.ServiceGetAll(filterModel).subscribe((res) => {
      res.ListItems.forEach((item) => {
        this.dataSource = res;
      });
    });
  }

  onClickAddComment(): void {
    const model = {
      id: +this.activatedRoute.snapshot.params.id,
      comment: this.comment,
      author: this.author
    };
    this.newsCommentService.ServiceAdd(model).subscribe((res) => {

    });
  }

  onActionTableSelect(row: any): void {
    this.tableContentSelected = [row];
  }

  onClickEditComment(element): void {
    const model = {
      id: element.Id,
      comment: element.Comment,
      author: element.Writer
    };
    this.newsCommentService.ServiceEdit(model).subscribe();
  }
}
