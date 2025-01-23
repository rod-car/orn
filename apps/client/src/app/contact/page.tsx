export default async function Contact() {
    return <section id="contact" className="contact-section main-section">
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
                                        <p>032 11 158 37</p>
                                        <p>ornatsinanana@gmail.com</p>
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
                                        <p>Villa Eglé, angle Boulevard Augagneur </p>
                                        <p>Toamasina I, Madagascar</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-12">
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <i className="lni lni-alarm-clock"></i>
                                    </div>
                                    <div className="contact-content">
                                        <h4>Facebook</h4>
                                        <p>ORN Atsinanana</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="contact-form-wrapper">
                        <div className="row">
                            <div className="row">
                                <div className="col-xl-10 col-lg-8 mx-auto">
                                    <div className="section-title text-center mb-50">
                                        <span className="wow fadeInDown" data-wow-delay=".2s">Contactez-nous</span>
                                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Prêt à commencer</h2>
                                        <p className="wow fadeInUp" data-wow-delay=".6s">At vero eos et accusamus et iusto odio dignissimos ducimus quiblanditiis praesentium</p>
                                    </div>
                                </div>
                            </div>
                            <form action="/php/mail.php" className="contact-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" name="name" id="name" placeholder="Nom" required />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="email" name="email" id="email" placeholder="Email" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" name="phone" id="phone" placeholder="Telephone" required />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text" name="subject" id="subject" placeholder="Objet" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <textarea name="message" id="message" placeholder="Message" rows={5}></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="button text-center">
                                            <button type="submit" className="theme-btn">Envoyer le message</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
}