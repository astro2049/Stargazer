import Navbar from "./Navbar/Navbar.tsx";
import Main from "./main/Main.tsx";
import Footer from "./Footer/Footer.tsx";

function App() {
    return (
        <div className="mx-[75px] lg:mx-[100px] bg-[#f3f3f3] border-l-2 border-r-2 border-black">
            <Navbar></Navbar>
            <Main></Main>
            <Footer></Footer>
        </div>
    )
}

export default App
