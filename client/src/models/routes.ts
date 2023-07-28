export interface ICheckRouteAvailability {
  Component: React.FC;
  path: string;
  redirectLink?: string;
  admin?: boolean;
}
