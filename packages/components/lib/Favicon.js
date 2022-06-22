import React from "react";
const Favicon = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" }),
        React.createElement("link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" }),
        React.createElement("link", { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" }),
        React.createElement("link", { rel: "manifest", href: "/favicon/site.webmanifest" }),
        React.createElement("link", { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#5bbad5" }),
        React.createElement("meta", { name: "apple-mobile-web-app-title", content: "Snippit" }),
        React.createElement("meta", { name: "application-name", content: "<APP NAME>" }),
        React.createElement("meta", { name: "msapplication-TileColor", content: "#ffc40d" }),
        React.createElement("meta", { name: "theme-color", content: "#ffffff" })));
};
export default Favicon;
