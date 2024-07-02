import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";

function PageLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default PageLayout;