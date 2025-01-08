import Image from "next/image";

export default function Home() {
  return <>
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold tracking-wide">Organisation</h1>
          <nav className="hidden md:flex space-x-6 text-lg">
            <a href="#about" className="hover:underline hover:text-blue-200">À propos</a>
            <a href="#services" className="hover:underline hover:text-blue-200">Services</a>
            <a href="#contact" className="hover:underline hover:text-blue-200">Contact</a>
          </nav>
          <button className="md:hidden bg-white text-blue-600 p-2 rounded shadow hover:bg-blue-100">
            Menu
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-center py-40">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-extrabold tracking-wide">Bienvenue à notre Organisation</h2>
          <p className="mt-4 text-lg">Nous créons des solutions pour un avenir meilleur.</p>
          <a
            href="#contact"
            className="mt-6 inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-medium shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Contactez-nous
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto py-16 px-6">
        <h3 className="text-4xl font-bold text-center text-gray-700">À propos de nous</h3>
        <p className="mt-4 text-center text-gray-600">
          Nous sommes une organisation dédiée à l'excellence et à la satisfaction de nos clients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <h4 className="font-bold text-2xl">Notre Mission</h4>
            <p className="mt-4 text-gray-600">Fournir des services de qualité supérieure.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <h4 className="font-bold text-2xl">Notre Vision</h4>
            <p className="mt-4 text-gray-600">Créer un impact positif dans la société.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <h4 className="font-bold text-2xl">Nos Valeurs</h4>
            <p className="mt-4 text-gray-600">Intégrité, innovation, et excellence.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-gray-700">Nos Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="font-bold text-2xl">Service 1</h4>
              <p className="mt-4 text-gray-600">Description détaillée du service 1.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="font-bold text-2xl">Service 2</h4>
              <p className="mt-4 text-gray-600">Description détaillée du service 2.</p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="font-bold text-2xl">Service 3</h4>
              <p className="mt-4 text-gray-600">Description détaillée du service 3.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold">Contactez-nous</h3>
          <p className="mt-4">
            Remplissez le formulaire ci-dessous ou envoyez-nous un e-mail à{" "}
            <a href="mailto:info@organisation.com" className="underline">info@organisation.com</a>.
          </p>
          <form className="mt-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nom"
                className="p-4 rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="p-4 rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <textarea
              placeholder="Message"
              className="mt-6 p-4 rounded bg-gray-100 text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="mt-6 px-8 py-4 bg-white text-blue-600 rounded-full font-medium shadow-md hover:bg-gray-200 transition-all duration-300"
            >
              Envoyer
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Organisation. Tous droits réservés.</p>
          <p className="mt-2 text-sm">Créé avec soin et passion.</p>
        </div>
      </footer>
    </div>
  </>
}
