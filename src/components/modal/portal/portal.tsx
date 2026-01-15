import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

function Portal(props: PortalProps) {
  const children = props.children;
  const [container] = useState(() => document.createElement("div"));

  useEffect(
    function () {
      document.body.appendChild(container);

      return function () {
        document.body.removeChild(container);
      };
    },
    [container]
  );

  return ReactDOM.createPortal(children, container);
}

export default Portal;
