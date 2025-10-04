import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('../../components/account/account.routes'),
  },
  {
    path: 'role',
    loadChildren: () => import('../../components/role/role.routes'),
  },
  {
    path: 'user',
    loadChildren: () => import('../../components/user/user.routes'),
  },
  {
    path: 'attribute',
    loadChildren: () => import('../../components/attribute/attribute.routes'),
  },
  {
    path: 'tag',
    loadChildren: () => import('../../components/tag/tag.routes'),
  },
  {
    path: 'blog',
    loadChildren: () => import('../../components/blog/blog.routes'),
  },
  {
    path: 'page',
    loadChildren: () => import('../../components/page/page.routes'),
  },
  {
    path: 'tax',
    loadChildren: () => import('../../components/tax/tax.routes'),
  },
  {
    path: 'store',
    loadChildren: () => import('../../components/store/store.routes'),
  },
  {
    path: 'category',
    loadChildren: () => import('../../components/category/category.routes'),
  },
  {
    path: 'shipping',
    loadChildren: () => import('../../components/shipping/shipping.routes'),
  },
  {
    path: 'media',
    loadChildren: () => import('../../components/media/media.routes'),
  },
  {
    path: 'coupon',
    loadChildren: () => import('../../components/coupon/coupon.routes'),
  },
  {
    path: 'product',
    loadChildren: () => import('../../components/product/product.routes'),
  },
  {
    path: 'currency',
    loadChildren: () => import('../../components/currency/currency.routes'),
  },
  {
    path: 'wallet',
    loadChildren: () => import('../../components/wallet/wallet.routes'),
  },
  {
    path: 'point',
    loadChildren: () => import('../../components/point/point.routes'),
  },
  {
    path: 'setting',
    loadChildren: () => import('../../components/setting/setting.routes'),
  },
  {
    path: 'order-status',
    loadChildren: () => import('../../components/order-status/order-status.routes'),
  },
  {
    path: 'order',
    loadChildren: () => import('../../components/order/order.routes'),
  },
  {
    path: 'theme-option',
    loadChildren: () => import('../../components/theme-option/theme-option.routes'),
  },
  {
    path: 'theme',
    loadChildren: () => import('../../components/theme/theme.routes'),
  },
  {
    path: 'commission',
    loadChildren: () => import('../../components/commission/commission.routes'),
  },
  {
    path: 'vendor-wallet',
    loadChildren: () => import('../../components/vendor-wallet/vendor-wallet.routes'),
  },
  {
    path: 'payment-details',
    loadChildren: () => import('../../components/payout-details/payout-details.routes'),
  },
  {
    path: 'review',
    loadChildren: () => import('../../components/review/review.routes'),
  },
  {
    path: 'faq',
    loadChildren: () => import('../../components/faq/faq.routes'),
  },
  {
    path: 'notification',
    loadChildren: () => import('../../components/notification/notification.routes'),
  },
  {
    path: 'refund',
    loadChildren: () => import('../../components/refund/refund.routes'),
  },
  {
    path: 'withdrawal',
    loadChildren: () => import('../../components/withdrawal/withdrawal.routes'),
  },
  {
    path: 'qna',
    loadChildren: () => import('../../components/questions-answers/questions-answers.routes'),
  },
];
