import { ChangeEvent, KeyboardEvent, ReactNode, useState } from "react";
import icons from '@base/assets/icons';
import { Link } from "@base/components/Router";

export function SearchBar(): ReactNode {
    const [search, setSearch] = useState("")
    const [similarSearch, setSimilarSearch] = useState<Record<string, string>>({})
    const [showSuggestion, setShowSuggestion] = useState(false)

    let links = Array.from(document.querySelectorAll("a"))
    const searchableLinks: Record<string, string> = {}

    const clientUrl = "http://localhost:5173/"
    links = links.filter(link => {
        const href = link.href.replace(clientUrl, "");
        return !href.startsWith("#")
    })

    links.forEach(link => {
        if(link.innerText !== "") searchableLinks[link.innerText] = link.href
    })

    function handleFocus() {
        if (search !== "") setShowSuggestion(true)
    }

    function handleKey(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape") {
            setSearch('')
            setSimilarSearch({})
            setShowSuggestion(false)
        }
    }

    function handleBlur() {
        setTimeout(() => {
            setShowSuggestion(false)
        }, 100)
    }

    function handleSearch(e: ChangeEvent<HTMLInputElement>) {
        const {value} = e.target
        setSearch(value)

        let results: Record<string, string> = {}

        if (value !== "") Object.keys(searchableLinks).map(label => {
            const link = searchableLinks[label].toLowerCase()
            const v = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            const l = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
            if (value !== " " && (l.includes(v) || link.includes(v))) {
                results[label] = searchableLinks[label]
                setShowSuggestion(true)
            }
        })
        else results = {}

        if (Object.keys(results).length <= 0 && value === "") setShowSuggestion(false)
        setSimilarSearch(results)
    }

    function resetSearch() {
        handleBlur()
    }

    return <>
        <div className="search-mobile-trigger d-sm-none col">
            <i className="search-mobile-trigger-icon fa-solid fa-magnifying-glass"></i>
        </div>
        <div className="app-search-box col">
            <form className="app-search-form">
                <input onKeyUp={handleKey} onBlur={handleBlur} onFocus={handleFocus} onChange={handleSearch} value={search} placeholder="Rechercher..." className="form-control search-input" />
                <div className="btn search-btn btn-primary">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="app-notifications-dropdown dropdown">
                    <div className={`${showSuggestion ? 'show' : ''} dropdown-menu p-0 mt-3 w-100`}>
                        <div className="dropdown-menu-header p-3">
                            <h5 className="dropdown-menu-title mb-0">Liens qui correspond</h5>
                        </div>
                        <div className="dropdown-menu-content" style={{ maxHeight: 300, overflowY: 'auto', overflowX: 'hidden' }}>
                            {Object.keys(similarSearch).length <= 0 && <div className="itep p-3">
                                <div className="info text-sm text-center">
                                    <div className="desc text-primary">Aucune correspondance</div>
                                </div>
                            </div>}
                            {Object.keys(similarSearch).map((label, index) => {
                                const link = similarSearch[label]
                                return <SuggestionItem onClick={resetSearch} key={index} label={label} link={link} />
                            })}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>
}

function SuggestionItem({label, link, onClick}: {label: string, link: string, onClick: () => void}): ReactNode {
    return <div className="item p-3">
        <div className="row gx-2 justify-content-between align-items-center">
            <div className="col-auto">
                <img className="profile-image" style={{ width: 20, height: 'auto' }} src={icons.link} alt="" />
            </div>
            <div className="col">
                <div className="info text-sm">
                    <div className="desc">{label}</div>
                    <div className="meta"> #</div>
                </div>
            </div>
        </div>
        <Link onClick={onClick} className="link-mask" to={link}></Link>
    </div>
}