function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-t-sector-divider">
            <h1 className="
                pt-4 pb-4
                flex justify-center items-center"
            >
                Stargazer
            </h1>
            <div className="pl-1 pr-1 flex justify-center">
                <div className="
                    w-[600px] max-w-full
                    pt-1 pb-3
                    flex justify-between
                    border-t border-[#f3f3f3]"
                >
                    <div>
                        @ <a href="https://github.com/astro2049" className="hover:underline">astro</a>
                    </div>
                    <div>
                        Credits
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
