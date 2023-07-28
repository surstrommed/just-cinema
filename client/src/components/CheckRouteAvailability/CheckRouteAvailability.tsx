import { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { ICheckRouteAvailability } from "models/routes";
import {
  ONLY_AUTHORIZED_ROUTES,
  ONLY_NOT_AUTHORIZED_ROUTES,
  ROUTES,
} from "constants/routes";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { ADMIN_ROLE, SUPER_ADMIN_ROLE } from "constants/common";
import { AdminSidebar } from "components/AdminSidebar";
import { Header } from "components/Header";
import { AdminSidebarContext, sidebarWidth } from "App";
import { ComponentWrapper } from "components/ComponentWrapper";
import { AdminSidebarHeader } from "components/AdminSidebar/AdminSidebarHeader";
import { Loader } from "components/Loader";
import { storeLoadingStatusDetector } from "utils";

export const CheckRouteAvailability: FC<ICheckRouteAvailability> = observer(
  ({
    Component,
    path,
    redirectLink = ROUTES.signin,
    admin = false,
    ...props
  }) => {
    const { userStore, uploadFileStore, manageAdminsStore } = useStore();
    const userRole = userStore.user?.role;
    const isAdmin = userRole === ADMIN_ROLE || userRole === SUPER_ADMIN_ROLE;

    const { isAdminSidebarOpened } = useContext(AdminSidebarContext);

    const isLoading =
      storeLoadingStatusDetector(userStore.statuses) ||
      storeLoadingStatusDetector(uploadFileStore.statuses) ||
      storeLoadingStatusDetector(manageAdminsStore.statuses);

    if (isLoading) {
      return <Loader isLoading={isLoading} />;
    }

    if (!userStore.user && ONLY_AUTHORIZED_ROUTES.includes(path)) {
      return <Navigate to={redirectLink} />;
    }

    if (
      (userStore.user && ONLY_NOT_AUTHORIZED_ROUTES.includes(path)) ||
      (userStore.user && admin && !isAdmin)
    ) {
      return <Navigate to={ROUTES.main} />;
    }

    return (
      <>
        {isAdmin ? (
          <AdminSidebar
            header={<Header />}
            content={
              <ComponentWrapper
                open={isAdminSidebarOpened}
                sidebarwidth={sidebarWidth}
              >
                <AdminSidebarHeader />
                <Component {...props} />
              </ComponentWrapper>
            }
          />
        ) : (
          <>
            <Header />
            <Component {...props} />
          </>
        )}
      </>
    );
  }
);
