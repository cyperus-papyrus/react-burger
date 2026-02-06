import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../services/store";
import { ReactElement } from "react";

interface ProtectedRouteElementProps {
  element: ReactElement;
  onlyUnauth?: boolean;
}

function ProtectedRouteElement({
  element,
  onlyUnauth = false,
}: ProtectedRouteElementProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (onlyUnauth && isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
}

export default ProtectedRouteElement;
