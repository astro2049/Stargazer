import Sector0_Navbar from "./Stargazer/Sectors/Sector 0_Navbar/Sector 0_Navbar.tsx";
import Main from "./Stargazer/Main.tsx";
import Sector4_Footer from "./Stargazer/Sectors/Sector 4_Footer/Sector 4_Footer.tsx";

function App() {
    return (
        <div className="bg-neutral-900 border-l border-r border-stone-800">
            <Sector0_Navbar></Sector0_Navbar>
            <Main></Main>
            <Sector4_Footer></Sector4_Footer>
        </div>
    )
}

export default App
