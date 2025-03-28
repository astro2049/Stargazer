import Navbar from "./sections/Navbar/Navbar.tsx";
import Main from "./sections/Main/Main.tsx";
import Footer from "./sections/Footer/Footer.tsx";

function App() {
    return (
        <div className="bg-neutral-900 border-l border-r border-stone-800">
            <Navbar></Navbar>
            <Main></Main>
            <Footer></Footer>
        </div>
    )
}

export default App
