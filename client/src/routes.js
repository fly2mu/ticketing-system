export const Routes = {
  // pages

  // USER
  Signin: { path: "/" },
  ListUserRequests: { path: "/ticketing/list-request" },
  AddRequest: { path: "/ticketing/add-request" },

  // ADMIN
  // SigninAdmin: { path: "/ticketing/login-admin" },
  UserRequests: { path: "/ticketing/admin/requests" },
  UserData: { path: "/ticketing/admin/users" },
  Categories: { path: "/ticketing/admin/categories" },

  // HEAD
  ListRequestHead: { path: "/ticketing/head/requests" },

  // TEAM
  UserRequestTeam: { path: "/ticketing/team/requests" },
  RequestReport: { path: "/ticketing/team/report-requests" },

  // BOTH
  Profile: { path: "/ticketing/profile" },
  DashboardOverview: { path: "/ticketing/dashboard/overview" },
  DetailRequest: { path: "/ticketing/detail-request/:id" },
  Chat: { path: "/ticketing/request/chat/:id/status/:status_ticket" },
  Upgrade: { path: "/ticketing/upgrade" },
  Billing: { path: "/examples/billing" },
  Invoice: { path: "/examples/invoice" },
  Signup: { path: "/examples/sign-up" },
  ForgotPassword: { path: "/examples/forgot-password" },
  ResetPassword: { path: "/examples/reset-password" },
  Lock: { path: "/examples/lock" },
  NotFound: { path: "/examples/404" },
  ServerError: { path: "/examples/500" },
};
