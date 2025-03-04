import './App.css'
import Navbar from "./navbar/Navbar.tsx";
import Main from "./main/Main.tsx";
import Footer from "./footer/Footer.tsx";

function App() {
    return (
        <div id="container" className="mx-[75px] lg:mx-[100px]">
            <Navbar></Navbar>
            <Main></Main>
            <Footer></Footer>
        </div>
    )
}

export default App
