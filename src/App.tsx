import Navbar from "./Navbar/Navbar.tsx";
import Main from "./main/Main.tsx";
import Footer from "./Footer/Footer.tsx";

function App() {
    return (
        <div className="bg-neutral-900 border-l-2 border-r-2 border-stone-800">
            <Navbar></Navbar>
            <Main></Main>
            <Footer></Footer>
        </div>
    )
}

export default App
