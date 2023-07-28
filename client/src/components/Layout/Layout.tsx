import React from "react";
import { CheckRouteAvailability } from "components/CheckRouteAvailability";
import { ROUTES } from "constants/routes";
import { AdminPanel } from "pages/AdminPanel";
import { Home } from "pages/Home";
import { NotFound } from "pages/NotFound";
import { Profile } from "pages/Profile";
import { SignIn } from "pages/SignIn";
import { SignUp } from "pages/SignUp";
import { Routes, Route } from "react-router-dom";
import { FilmsByCategory } from "pages/Films/FilmsByCategory";
import { Film } from "pages/Films/Film";
import { WatchLater } from "pages/Films/WatchLater";
import { Actors } from "pages/Actors";

export const Layout = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.main}
        element={<CheckRouteAvailability Component={Home} path={ROUTES.main} />}
      />
      <Route
        path={ROUTES.mainWithPage}
        element={
          <CheckRouteAvailability Component={Home} path={ROUTES.mainWithPage} />
        }
      />
      <Route
        path={ROUTES.signin}
        element={
          <CheckRouteAvailability Component={SignIn} path={ROUTES.signin} />
        }
      />
      <Route
        path={ROUTES.signup}
        element={
          <CheckRouteAvailability Component={SignUp} path={ROUTES.signup} />
        }
      />
      <Route
        path={ROUTES.profile}
        element={
          <CheckRouteAvailability Component={Profile} path={ROUTES.profile} />
        }
      />
      <Route
        path={ROUTES.adminPanel}
        element={
          <CheckRouteAvailability
            Component={AdminPanel}
            path={ROUTES.adminPanel}
            admin
          />
        }
      />
      <Route
        path={ROUTES.adminPanelCreateAdmin}
        element={
          <CheckRouteAvailability
            Component={AdminPanel}
            path={ROUTES.adminPanelCreateAdmin}
            admin
          />
        }
      />
      <Route
        path={ROUTES.adminPanelCreateActor}
        element={
          <CheckRouteAvailability
            Component={AdminPanel}
            path={ROUTES.adminPanelCreateActor}
            admin
          />
        }
      />
      <Route
        path={ROUTES.adminPanelCreateContent}
        element={
          <CheckRouteAvailability
            Component={AdminPanel}
            path={ROUTES.adminPanelCreateContent}
            admin
          />
        }
      />
      <Route
        path={ROUTES.filmsByCategory}
        element={
          <CheckRouteAvailability
            Component={FilmsByCategory}
            path={ROUTES.filmsByCategory}
          />
        }
      />
      <Route
        path={ROUTES.film}
        element={<CheckRouteAvailability Component={Film} path={ROUTES.film} />}
      />
      <Route
        path={ROUTES.watchLater}
        element={
          <CheckRouteAvailability
            Component={WatchLater}
            path={ROUTES.watchLater}
          />
        }
      />
      <Route
        path={ROUTES.actors}
        element={
          <CheckRouteAvailability Component={Actors} path={ROUTES.actors} />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
