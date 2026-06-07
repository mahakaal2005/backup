import "./Header.css";

export default function Header(){
    return(
        <header className="header">
            <h1 className="header-title">This is My First React App</h1>
            <nav className="header-nav">
                <a href="#" className="header-link">Home</a>
                <a href="#" className="header-link">About</a>
                <a href="#" className="header-link">Contact</a>
            </nav>
        </header>
    )
}
