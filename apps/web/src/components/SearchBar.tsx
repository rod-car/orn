import { ReactNode } from "react";

export function SearchBar(): ReactNode {
    return <>
        <div className="search-mobile-trigger d-sm-none col">
            <i className="search-mobile-trigger-icon fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="app-search-box col">
            <form className="app-search-form">
                <input type="text" placeholder="Search..." name="search" className="form-control search-input" />
                <button type="submit" className="btn search-btn btn-primary" value="Search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
        </div>
    </>
}