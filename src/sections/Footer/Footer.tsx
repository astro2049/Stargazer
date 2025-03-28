function Footer() {
    return (
        <footer className="bg-neutral-950 border-t border-t-white/10">
            <h1 className="
                py-3
                flex justify-center items-center"
            >
                Stargazer
            </h1>
            <div className="pl-1 pr-1 flex justify-center">
                <div className="
                    w-[600px] max-w-full
                    pt-1 pb-3
                    flex justify-between
                    border-t border-white/50"
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
