import { CommonModule, DatePipe, isPlatformBrowser, SlicePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  Renderer2,
  DOCUMENT,
  viewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexResponsive,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { Select2Data, Select2Module, Select2UpdateEvent } from 'ng-select2-component';
import { Observable } from 'rxjs';

import { GetBlogsAction } from '../../shared/action/blog.action';
import { GetCategoriesAction } from '../../shared/action/category.action';
import {
  GetRevenueChartAction,
  GetStatisticsCountAction,
} from '../../shared/action/dashboard.action';
import { GetOrdersAction } from '../../shared/action/order.action';
import { GetProductsAction } from '../../shared/action/product.action';
import { GetReviewsAction } from '../../shared/action/review.action';
import { GetStoresAction } from '../../shared/action/store.action';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/ui/table/table';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { IAccountUser } from '../../shared/interface/account.interface';
import { IBlogModel } from '../../shared/interface/blog.interface';
import { Params } from '../../shared/interface/core.interface';
import { IRevenueChart, IStatisticsCount } from '../../shared/interface/dashboard.interface';
import { IOrder, IOrderModel } from '../../shared/interface/order.interface';
import { IProduct, IProductModel } from '../../shared/interface/product.interface';
import { IReviewModel } from '../../shared/interface/review.interface';
import { IStoresModel } from '../../shared/interface/store.interface';
import { ITableClickedAction, ITableConfig } from '../../shared/interface/table.interface';
import {
  CurrencySymbolPipe as CurrencySymbolPipe_1,
  CurrencySymbolPipe,
} from '../../shared/pipe/currency-symbol.pipe';
import { AccountState } from '../../shared/state/account.state';
import { BlogState } from '../../shared/state/blog.state';
import { CategoryState } from '../../shared/state/category.state';
import { DashboardState } from '../../shared/state/dashboard.state';
import { OrderState } from '../../shared/state/order.state';
import { ProductState } from '../../shared/state/product.state';
import { ReviewState } from '../../shared/state/review.state';
import { StoreState } from '../../shared/state/store.state';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  markers: ApexMarkers;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  providers: [CurrencySymbolPipe],
  imports: [
    PageWrapper,
    HasPermissionDirective,
    Select2Module,
    Table,
    RouterModule,
    NgbRating,
    CommonModule,
    SlicePipe,
    DatePipe,
    TranslateModule,
    CurrencySymbolPipe_1,
  ],
})
export class Dashboard {
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private document = inject<Document>(DOCUMENT);
  private store = inject(Store);
  private router = inject(Router);

  statistics$: Observable<IStatisticsCount | null> = inject(Store).select(
    DashboardState.statistics,
  );
  revenueChart$: Observable<IRevenueChart | null> = inject(Store).select(
    DashboardState.revenueChart,
  );
  order$: Observable<IOrderModel | null> = inject(Store).select(OrderState.order);
  product$: Observable<IProductModel> = inject(Store).select(ProductState.product);
  topProduct$: Observable<IProduct[]> = inject(Store).select(ProductState.topSellingProducts);
  review$: Observable<IReviewModel> = inject(Store).select(ReviewState.review);
  blog$: Observable<IBlogModel> = inject(Store).select(BlogState.blog);
  category$: Observable<Select2Data> = inject(Store).select(CategoryState.categories);
  store$: Observable<IStoresModel> = inject(Store).select(StoreState.store);
  user$: Observable<IAccountUser> = inject(Store).select(AccountState.user);
  readonly chart = viewChild.required<ElementRef>('chart');
  public chartOptions!: Partial<ChartOptions>;

  public topProductLoader: boolean = false;
  public productStockLoader: boolean = false;
  public topSellerLoader: boolean = false;
  public isBrowser: boolean;

  public filter: Select2Data = [
    {
      value: 'today',
      label: 'Today',
    },
    {
      value: 'last_week',
      label: 'Last Week',
    },
    {
      value: 'last_month',
      label: 'Last Month',
    },
    {
      value: 'this_year',
      label: 'This Year',
    },
  ];

  public sellerTableConfig: ITableConfig = {
    columns: [
      { title: 'store_name', dataField: 'store_name' },
      { title: 'orders', dataField: 'orders_count' },
      { title: 'earning', dataField: 'order_amount' },
    ],
    data: [],
    total: 0,
  };

  public orderTableConfig: ITableConfig = {
    columns: [
      { title: 'number', dataField: 'order_id' },
      { title: 'date', dataField: 'created_at', type: 'date', date_format: 'dd MMM yyyy' },
      { title: 'name', dataField: 'consumer_name' },
      { title: 'amount', dataField: 'total', type: 'price' },
      { title: 'payment', dataField: 'order_payment_status' },
    ],
    rowActions: [
      { label: 'View', actionToPerform: 'view', icon: 'ri-eye-line', permission: 'order.edit' },
    ],
    data: [],
    total: 0,
  };

  public productStockTableConfig: ITableConfig = {
    columns: [
      {
        title: 'image',
        dataField: 'product_thumbnail',
        class: 'tbl-image',
        type: 'image',
        placeholder: 'assets/images/product.png',
      },
      { title: 'name', dataField: 'name' },
      { title: 'quantity', dataField: 'quantity' },
      { title: 'stock', dataField: 'stock' },
    ],
    rowActions: [
      {
        label: 'Edit',
        actionToPerform: 'edit',
        icon: 'ri-pencil-line',
        permission: 'product.edit',
      },
    ],
    data: [] as IProduct[],
    total: 0,
  };

  constructor() {
    const config = inject(NgbRatingConfig);
    const platformId = this.platformId;

    this.isBrowser = isPlatformBrowser(platformId);
    config.max = 5;
    config.readonly = true;

    // Revenue & Commision Chart
    this.revenueChart$.subscribe(revenue => {
      if (revenue) {
        this.chartOptions = {
          series: [
            {
              name: 'Revenue',
              data: revenue.revenues,
              color: '#0da487',
            },
            {
              name: 'Comission',
              data: revenue.commissions,
              color: '#FFA53B',
            },
          ],
          chart: {
            height: 350,
            type: 'line',
            dropShadow: {
              enabled: true,
              top: 10,
              left: 0,
              blur: 3,
              color: '#720f1e',
              opacity: 0.1,
            },
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          markers: {
            strokeWidth: 4,
            strokeColors: '#ffffff',
            hover: {
              size: 9,
            },
          },
          stroke: {
            curve: 'smooth',
            lineCap: 'butt',
            width: 4,
          },
          grid: {
            xaxis: {
              lines: {
                show: true,
              },
            },
            yaxis: {
              lines: {
                show: false,
              },
            },
          },
          legend: {
            show: false,
          },
          responsive: [
            {
              breakpoint: 1200,
              options: {
                grid: {
                  padding: {
                    right: -95,
                  },
                },
              },
            },
            {
              breakpoint: 992,
              options: {
                grid: {
                  padding: {
                    right: -69,
                  },
                },
              },
            },
            {
              breakpoint: 767,
              options: {
                chart: {
                  height: 200,
                },
              },
            },
            {
              breakpoint: 576,
              options: {
                yaxis: {
                  labels: {
                    show: false,
                  },
                },
              },
            },
          ],
          xaxis: {
            categories: revenue.months,
            range: undefined,
            axisBorder: {
              offsetX: 0,
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
        };
      }
    });

    // For Order
    this.order$.subscribe(order => {
      this.orderTableConfig.data = order ? order?.data.slice(0, 5) : [];
      this.orderTableConfig.total = order ? order?.total : 0;
    });

    this.order$.subscribe(order => {
      let orders = order?.data?.filter((element: IOrder) => {
        element.order_id = `<span class="fw-bolder">#${element.order_number}</span>`;
        element.order_payment_status = element.payment_status
          ? `<div class="status-${element.payment_status.toLowerCase()}"><span>${element.payment_status.replace(/_/g, ' ')}</span></div>`
          : '-';
        element.consumer_name = `<span class="text-capitalize">${element.consumer.name}</span>`;
        return element;
      });
      this.orderTableConfig.data = order ? orders?.slice(0, 5) : [];
      this.orderTableConfig.total = order ? order?.total : 0;
    });

    // For Product
    this.product$.subscribe(product => {
      let products = product?.data?.filter((element: IProduct) => {
        element.stock = element.stock_status
          ? `<div class="status-${element.stock_status}"><span>${element.stock_status.replace(/_/g, ' ')}</span></div>`
          : '-';
        return element;
      });
      this.productStockTableConfig.data = product ? products.slice(0, 8) : [];
      this.productStockTableConfig.total = product ? product?.total : 0;
    });

    // For Store
    this.store$.subscribe(store => {
      this.sellerTableConfig.data = store ? store?.data?.slice(0, 6) : [];
      this.sellerTableConfig.total = store ? store?.total : 0;
    });
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ApexCharts = (await import('apexcharts')).default;
      const element = this.chart().nativeElement;
      var chart = new ApexCharts(element, this.chartOptions);
      void chart.render();
    }
  }

  ngOnInit() {
    this.store.dispatch(new GetStatisticsCountAction());
    this.store.dispatch(new GetRevenueChartAction());
    this.store.dispatch(
      new GetProductsAction({ status: 1, top_selling: 1, filter_by: 'this_year', paginate: 5 }),
    );
    this.store.dispatch(new GetReviewsAction({ paginate: 5 }));
    this.store.dispatch(new GetBlogsAction({ status: 1, paginate: 2 }));
    this.store.dispatch(new GetCategoriesAction({ type: 'product', status: 1 }));
  }

  filterTopProduct(data: Select2UpdateEvent) {
    this.topProductLoader = true;
    this.renderer.addClass(this.document.body, 'loader-none');
    let params: Params = { status: 1, top_selling: 1, filter_by: 'this_year', paginate: 5 };
    if (data.value) {
      params['filter_by'] = data.value;
    }
    this.store.dispatch(new GetProductsAction(params)).subscribe({
      complete: () => {
        this.topProductLoader = false;
      },
    });
  }

  // For Order

  onOrderTableChange(data?: Params) {
    if (data) {
      data['paginate'] = 7;
    }
    this.store.dispatch(new GetOrdersAction(data!));
  }

  onOrderActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'view') this.orderView(action.data);
  }

  orderView(data: IOrder) {
    void this.router.navigateByUrl(`/order/details/${data.order_number}`);
  }

  // For Products

  onProductTableChange(data?: Params) {
    if (data) {
      data['paginate'] = 8;
      data['field'] = 'quantity';
      data['sort'] = 'asc';
    }
    this.store.dispatch(new GetProductsAction(data)).subscribe({
      complete: () => {
        this.productStockLoader = false;
      },
    });
  }

  filterProduct(data: Select2UpdateEvent) {
    this.renderer.addClass(this.document.body, 'loader-none');
    let params: Params = {
      paginate: 8,
      field: 'quantity',
      sort: 'asc',
    };
    if (data.value) {
      params['category_ids'] = data.value;
    }
    this.productStockLoader = true;
    this.onProductTableChange(params);
  }

  onProductActionClicked(action: ITableClickedAction) {
    if (action.actionToPerform == 'edit') this.productEdit(action.data);
  }

  productEdit(data: IProduct) {
    void this.router.navigateByUrl(`/product/edit/${data.id}`);
  }

  // For Seller

  onSellerTableChange(data?: Params) {
    if (data && !data['filter_by']) {
      data['paginate'] = 6;
      data['top_vendor'] = 1;
      data['filter_by'] = 'this_year';
    }
    this.store.dispatch(new GetStoresAction(data)).subscribe({
      complete: () => {
        this.topSellerLoader = false;
      },
    });
  }

  filterSeller(data: Select2UpdateEvent) {
    this.renderer.addClass(this.document.body, 'loader-none');
    let params: Params = {
      paginate: 6,
      top_vendor: 1,
      filter_by: 'this_year',
    };
    if (data.value) {
      params['filter_by'] = data.value;
    }
    this.topSellerLoader = true;
    this.onSellerTableChange(params);
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'loader-none');
  }
}
