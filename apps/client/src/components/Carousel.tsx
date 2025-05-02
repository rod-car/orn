import Link from "next/link";

type CarouselProps = {
    title: string;
    description: string;
    background: string;
    active?: boolean;
    more?: {
        text: string;
        link: string;
    }
}

export default function Carousel({title, description, background, more = undefined, active = false}: CarouselProps) {
    return <div className={`${active && 'active'} carousel-section carousel-item clip-bg pt-225 pb-200 img-bg`} style={{ backgroundImage: `url(${background})` }}>
        <div className="container">
            <div className="row">
                <div className="col-xl-8 col-lg-10 mx-auto">
                    <div className="carousel-content text-center">
                        <div className="section-title">
                            <h2 className="text-white">{title}</h2>
                            <p className="text-white">{description}</p>
                        </div>
                        {more && <Link href={more.link} className="theme-btn border-btn">{more.text}</Link>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}