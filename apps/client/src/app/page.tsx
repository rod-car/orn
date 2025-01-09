import Image from "next/image";

export default function Home() {
    return <>
        <section id="home" className="carousel-section-wrapper">
            <div id="carouselExampleCaptions" className="carousel slide carousel-fade" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-section carousel-item active clip-bg pt-225 pb-200 img-bg"
                        style={{backgroundImage: "url('/img/carousel/1.jpg')", backgroundPosition: "center"}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-8 col-lg-10 mx-auto">
                                    <div className="carousel-content text-center">
                                        <div className="section-title">
                                            <h2 className="text-white">Office Regional de Nutrition Atsinanana</h2>
                                            <p className="text-white">La nutrition, garant du développement social et économique pour Madagascar.</p>
                                        </div>
                                        <a href="javascript:void(0)" className="theme-btn border-btn">Voir plus</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-section carousel-item clip-bg pt-225 pb-200 img-bg" style={{ backgroundImage: "url('/img/carousel/2.jpg')" }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-8 col-lg-10 mx-auto">
                                    <div className="carousel-content text-center">
                                        <div className="section-title">
                                            <h2 className="text-white">Office Regional de Nutrition Atsinanana</h2>
                                            <p className="text-white">L'approche systémique pour la nutrition est un moyen de renforcer les relations, et donc la coordination, entre les différents secteurs qui ont un impact sur la nutrition.</p>
                                        </div>
                                        <a href="javascript:void(0)" className="theme-btn border-btn">Voir plus</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a className="carousel-control carousel-control-prev" href="#carouselExampleCaptions" role="button"
                    data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"><i className="lni lni-arrow-left"></i></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control carousel-control-next" href="#carouselExampleCaptions" role="button"
                    data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"><i className="lni lni-arrow-right"></i></span>
                    <span className="sr-only">Suivant</span>
                </a>
            </div>
        </section>

        <section id="features" className="feature-section pt-100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span className="wow fadeInDown" data-wow-delay=".2s">Features</span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Pourquoi nous?</h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio dignissimos ducimus quiblanditiis praesentium</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="feature-box box-style">
                            <div className="feature-icon box-icon-style">
                                <i className="lni lni-layers"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4>Bootstrap 5</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="feature-box box-style">
                            <div className="feature-icon box-icon-style">
                                <i className="lni lni-brush-alt"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4>Awesome Design</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="feature-box box-style">
                            <div className="feature-icon box-icon-style">
                                <i className="lni lni-pointer-up"></i>
                            </div>
                            <div className="box-content-style feature-content">
                                <h4>One-page Template</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" className="pt-100">
            <div className="about-section">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-lg-6">
                            <div className="about-img-wrapper">
                                <div className="about-img position-relative d-inline-block wow fadeInLeft" data-wow-delay=".3s">
                                    <img src="/img/about/about-img.png" alt="" />

                                    <div className="about-experience">
                                        <h3>5 Year Of Working Experience</h3>
                                        <p>We Crafted an aweso design library that is robust and intuitive to use.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                            <div className="about-content-wrapper">
                                <div className="section-title">
                                    <span className="wow fadeInUp" data-wow-delay=".2s">About Us</span>
                                    <h2 className="mb-40 wow fadeInRight" data-wow-delay=".4s">Built-With Boostrap 5, a New Experiance</h2>
                                </div>
                                <div className="about-content">
                                    <p className="mb-45 wow fadeInUp" data-wow-delay=".6s">We Crafted an awesome design library
                                        that is robust and intuitive to use. No matter you're building a business
                                        presentation websit or a complex web application our design</p>
                                    <div className="counter-up wow fadeInUp" data-wow-delay=".5s">
                                        <div className="counter">
                                            <span id="secondo" className="countup count color-1" cup-end="30" cup-append="k">10</span>
                                            <h4>Happy Client</h4>
                                            <p>We Crafted an awesome design <br className="d-none d-md-block d-lg-none d-xl-block" /> library that is robust and</p>
                                        </div>
                                        <div className="counter">
                                            <span id="secondo" className="countup count color-2" cup-end="42" cup-append="k">5</span>
                                            <h4>Project Done</h4>
                                            <p>We Crafted an awesome design <br className="d-none d-md-block d-lg-none d-xl-block" /> library that is robust and</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="services" className="service-section pt-130">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span className="wow fadeInDown" data-wow-delay=".2s">Services</span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Our Best Services</h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio
                                dignissimos ducimus quiblanditiis praesentium</p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-leaf"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Clean & Refreshing</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-bootstrap"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Solid Bootstrap 5</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-briefcase"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Crafted for Business</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-bolt"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Speed Optimized</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-infinite"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Fully Customizable</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="service-box box-style">
                            <div className="service-icon box-icon-style">
                                <i className="lni lni-reload"></i>
                            </div>
                            <div className="box-content-style service-content">
                                <h4>Regular Updates</h4>
                                <p>Lorem ipsum dolor sit amet, adipscing elitr, sed diam nonumy eirmod tempor ividunt
                                    labor dolore magna.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="portfolio" className="portfolio-section pt-130">
        <section id="team" className="contact-section cta-bg img-bg pt-110 pb-100" style={{backgroundImage: "url('/img/bg/cta-bg.jpg');"}}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-5 col-lg-7">
                        <div className="section-title mb-60">
                            <span
                                className="text-white wow fadeInDown"
                                data-wow-delay=".2s"
                                style={{visibility: 'visible', animationDelay: '0.2s', animationName: 'fadeInDown'}}
                            >Hey</span>
                            <h2 className="text-white wow fadeInUp" data-wow-delay=".4s" style={{}/*"visibility: visible; animation-delay: 0.4s; animation-name: fadeInUp;"*/}>You are using free lite version of Fancy</h2>
                            <p className="text-white wow fadeInUp" data-wow-delay=".6s" style={{}/*"visibility: visible; animation-delay: 0.6s; animation-name: fadeInUp;"*/}>Please, purchase full version of template to get all elements, section and permission to remove credits.</p>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-5">
                        <div className="contact-btn text-left text-lg-right">
                            <a href="https://rebrand.ly/fancy-ud" rel="nofollow" className="theme-btn">Purchase Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </section>

        <section id="process" className="process-section pt-100 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-7 col-md-9 mx-auto">
                        <div className="section-title text-center mb-55">
                            <span className="wow fadeInDown" data-wow-delay=".2s">Process</span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">Working Process</h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio
                                dignissimos ducimus quiblanditiis praesentium</p>
                        </div>
                    </div>
                </div>
                <div className="row align-items-center time-line">
                    <div className="col-12">
                        <div className="single-timeline">
                            <div className="row align-items-center">
                                <div className="col-lg-5 order-last order-lg-first">
                                    <div className="timeline-content left-content text-lg-right">
                                        <div className="box-icon-style">
                                            <i className="lni lni-search-alt"></i>
                                        </div>
                                        <h4 className="mb-10">Research</h4>
                                        <p>At vero eos et accusamus et iusto odio dignissimos quiblanditiis praesentium
                                            At vero eos et accusamus et iusto odio dignissimos ducimusm.</p>
                                    </div>
                                </div>
                                <div className="col-lg-2"></div>
                                <div className="col-lg-5">
                                    <div className="timeline-img">
                                        <img src="/img/timeline/timeline-1.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="single-timeline">
                            <div className="row align-items-center">
                                <div className="col-lg-5">
                                    <div className="timeline-img">
                                        <img src="/img/timeline/timeline-2.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-lg-2"></div>
                                <div className="col-lg-5">
                                    <div className="timeline-content right-content text-left">
                                        <div className="box-icon-style">
                                            <i className="lni lni-layers"></i>
                                        </div>
                                        <h4 className="mb-10">Design</h4>
                                        <p>At vero eos et accusamus et iusto odio dignissimos quiblanditiis praesentium
                                            At vero eos et accusamus et iusto odio dignissimos ducimusm.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="single-timeline">
                            <div className="row align-items-center">
                                <div className="col-lg-5 order-last order-lg-first">
                                    <div className="timeline-content left-content text-lg-right">
                                        <div className="box-icon-style">
                                            <i className="lni lni-code-alt"></i>
                                        </div>
                                        <h4 className="mb-10">Code</h4>
                                        <p>At vero eos et accusamus et iusto odio dignissimos quiblanditiis praesentium
                                            At vero eos et accusamus et iusto odio dignissimos ducimusm.</p>
                                    </div>
                                </div>
                                <div className="col-lg-2"></div>
                                <div className="col-lg-5">
                                    <div className="timeline-img">
                                        <img src="/img/timeline/timeline-3.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="single-timeline">
                            <div className="row align-items-center">
                                <div className="col-lg-5">
                                    <div className="timeline-img">
                                        <img src="/img/timeline/timeline-4.png" alt="" />
                                    </div>
                                </div>
                                <div className="col-lg-2"></div>
                                <div className="col-lg-5">
                                    <div className="timeline-content right-content text-left">
                                        <div className="box-icon-style">
                                            <i className="lni lni-rocket"></i>
                                        </div>
                                        <h4 className="mb-10">Launch</h4>
                                        <p>At vero eos et accusamus et iusto odio dignissimos quiblanditiis praesentium
                                            At vero eos et accusamus et iusto odio dignissimos ducimusm.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="team" className="contact-section cta-bg img-bg pt-110 pb-100" style={{}/*"backgroundImage: url('/img/bg/cta-bg.jpg');"*/}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-5 col-lg-7">
                        <div className="section-title mb-60">
                            <span className="text-white wow fadeInDown" data-wow-delay=".2s" style={{}/*"visibility: visible; animation-delay: 0.2s; animation-name: fadeInDown;"*/}>Hey</span>
                            <h2 className="text-white wow fadeInUp" data-wow-delay=".4s" style={{}/*"visibility: visible; animation-delay: 0.4s; animation-name: fadeInUp;"*/}>You are using free lite version of Fancy</h2>
                            <p className="text-white wow fadeInUp" data-wow-delay=".6s" style={{}/*"visibility: visible; animation-delay: 0.6s; animation-name: fadeInUp;"*/}>Please, purchase full version of template to get all elements, section and permission to remove credits.</p>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-5">
                        <div className="contact-btn text-left text-lg-right">
                            <a href="https://rebrand.ly/fancy-ud" rel="nofollow" className="theme-btn">Purchase Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="client-logo-section pt-100 pb-100">
            <div className="container">
                <div className="client-logo-wrapper">
                    <div className="client-logo-carousel d-flex align-items-center justify-content-between">
                        <div className="client-logo">
                            <img src="/img/client-logo/uideck-logo.svg" alt="" />
                        </div>
                        <div className="client-logo">
                            <img src="/img/client-logo/pagebulb-logo.svg" alt="" />
                        </div>
                        <div className="client-logo">
                            <img src="/img/client-logo/lineicons-logo.svg" alt="" />
                        </div>
                        <div className="client-logo">
                            <img src="/img/client-logo/graygrids-logo.svg" alt="" />
                        </div>
                        <div className="client-logo">
                            <img src="/img/client-logo/lineicons-logo.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" className="contact-section cta-bg img-bg pt-110 pb-100" style={{/*"backgroundImage: url('/img/bg/cta-bg.jpg');"*/}}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-5 col-lg-7">
                        <div className="section-title mb-60">
                            <span className="text-white wow fadeInDown" data-wow-delay=".2s">Hey</span>
                            <h2 className="text-white wow fadeInUp" data-wow-delay=".4s">Do you have any project in mind?</h2>
                            <p className="text-white wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio
                                dignissimos ducimus quiblanditiis praesentium</p>
                        </div>
                    </div>
                    <div className="col-xl-7 col-lg-5">
                        <div className="contact-btn text-left text-lg-right">
                            <a href="#portfolio" className="theme-btn">View Works</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="contact-section pt-130 pb-100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-4">
                        <div className="contact-item-wrapper">
                            <div className="row">
                                <div className="col-12 col-md-6 col-xl-12">
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="lni lni-phone"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Contact</h4>
                                            <p>0984537278623</p>
                                            <p>yourmail@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-xl-12">
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="lni lni-map-marker"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Address</h4>
                                            <p>175 5th Ave, New York, NY 10010 </p>
                                            <p>United States</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-xl-12">
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <i className="lni lni-alarm-clock"></i>
                                        </div>
                                        <div className="contact-content">
                                            <h4>Shedule</h4>
                                            <p>24 Hours / 7 Days Open </p>
                                            <p>Office time: 10 AM - 5:30 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="contact-form-wrapper">
                            <div className="row">
                                <div className="col-xl-10 col-lg-8 mx-auto">
                                    <div className="section-title text-center mb-50">
                                        <span className="wow fadeInDown" data-wow-delay=".2s">Get in Touch</span>
                                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Ready to Get Started</h2>
                                        <p className="wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio
                                            dignissimos ducimus quiblanditiis praesentium</p>
                                    </div>
                                </div>
                            </div>
                            <form action="/php/mail.php" className="contact-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" name="name" id="name" placeholder="Name" required />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="email" name="email" id="email" placeholder="Email" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" name="phone" id="phone" placeholder="Phone" required />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text" name="subject" id="email" placeholder="Subject" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <textarea name="message" id="message" placeholder="Type Message" rows={5}></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="button text-center">
                                            <button type="submit" className="theme-btn">Send Message</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="subscribe-section pt-70 pb-70 img-bg" style={{ backgroundImage: "url('/img/bg/common-bg.svg')" }}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-6">
                        <div className="section-title mb-30">
                            <span className="text-white wow fadeInDown" data-wow-delay=".2s">Subscribe</span>
                            <h2 className="text-white mb-40 wow fadeInUp" data-wow-delay=".4s">Subscribe Our Newsletter</h2>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                        <form action="#" className="subscribe-form wow fadeInRight" data-wow-delay=".4s">
                            <input type="text" name="subs-email" id="subs-email" placeholder="Your Email" />
                            <button type="submit"><i className="lni lni-telegram-original"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </>
}
